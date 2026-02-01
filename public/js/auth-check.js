// Authentication check for protected pages
async function checkAuth(redirectToLogin = true) {
    // Admin Session Override
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        return {
            id: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@trustyhands.com',
            profileImage: null,
            isAdmin: true
        };
    }

    try {
        const response = await fetch('/api/auth/session', {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.authenticated) {
            localStorage.setItem('th_logged_in', 'true');
            return data.user;
        } else if (redirectToLogin) {
            localStorage.removeItem('th_logged_in');
            window.location.href = '/login.html';
            return null;
        }
        localStorage.removeItem('th_logged_in');
        return null;
    } catch (error) {
        console.error('Auth check error:', error);
        if (redirectToLogin) {
            window.location.href = '/login.html';
        }
        return null;
    }
}

// Logout function
async function logout() {
    sessionStorage.removeItem('adminLoggedIn'); // Clear admin flag
    sessionStorage.removeItem('th_avatar_url'); // Clear cache
    localStorage.removeItem('th_logged_in'); // Clear predictive flag

    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = 'index.html';
    }
}

// Update user display in header (Global Handler)
function updateUserDisplay(user) {
    if (!user) return;

    // 1. Update Text Elements
    const elements = {
        'welcomeUserName': user.firstName || 'User',
        'userName': user.firstName + (user.lastName ? ' ' + user.lastName : ''),
        'userEmail': user.email,
        'userInitials': (user.firstName ? user.firstName.charAt(0) : 'U').toUpperCase(),
        'dropdownInitials': (user.firstName ? user.firstName.charAt(0) : 'U').toUpperCase()
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    // 2. Manage Visibility
    const profileContainer = document.getElementById('userProfile');
    const authLinks = document.getElementById('authLinks');

    if (profileContainer) profileContainer.style.display = 'flex';
    if (authLinks) authLinks.style.display = 'none';

    // 3. Update Avatar (Image or Initials)
    applyHeaderAvatar(user.profileImage, user.firstName);
}

// Helper: apply avatar image to header elements if they exist
function applyHeaderAvatar(avatarUrl, firstName = '') {
    const profileCircle = document.getElementById('profileToggle');
    const dropdownInitials = document.getElementById('dropdownInitials');

    // Logic to set image background
    const setAvatar = (url) => {
        if (profileCircle) {
            profileCircle.style.backgroundImage = `url('${url}')`;
            profileCircle.innerText = ''; // Clear initials if image loaded
        }
        if (dropdownInitials) {
            dropdownInitials.style.backgroundImage = `url('${url}')`;
            dropdownInitials.innerText = '';
        }
    };

    // Logic to clear image and show initials (handled by CSS background removal + text content)
    const clearAvatar = () => {
        if (profileCircle) profileCircle.style.backgroundImage = '';
        if (dropdownInitials) dropdownInitials.style.backgroundImage = '';
    };

    if (avatarUrl) {
        const img = new Image();
        img.onload = () => setAvatar(avatarUrl);
        img.onerror = () => clearAvatar();
        img.src = avatarUrl;
    } else {
        clearAvatar();
    }
}

// Auto-run: Check auth state and update UI globally on all pages
(function () {
    async function initGlobalAuth() {
        try {
            // 1. Predictive UI: Apply cached name immediately to prevent "Welcome, User" flicker
            try {
                const cachedName = localStorage.getItem('th_first_name');
                const cachedEmail = localStorage.getItem('th_user_email'); // Optional helper
                const cachedAvatar = localStorage.getItem('th_avatar_url');
                const loggedIn = localStorage.getItem('th_logged_in') === 'true';

                if (cachedName && loggedIn) {
                    // Construct a partial user object for instant render
                    const partialUser = {
                        firstName: cachedName,
                        email: cachedEmail || '',
                        profileImage: cachedAvatar,
                        lastName: '' // We might not have this cached, but first name is key
                    };
                    updateUserDisplay(partialUser);
                }
            } catch (e) { /* ignore storage errors */ }

            // 2. Fetch fresh session/profile data (The Source of Truth)
            const resp = await fetch('/api/auth/session', { credentials: 'include' });
            const data = await resp.json();

            if (data.authenticated && data.user) {
                // Update Cache
                localStorage.setItem('th_first_name', data.user.firstName);
                if (data.user.email) localStorage.setItem('th_user_email', data.user.email);

                // If logged in, update the entire header UI with authoritative data
                updateUserDisplay(data.user);

                // Secondary fetch for full profile (avatar) if needed
                if (!data.user.profileImage) {
                    const profResp = await fetch('/api/auth/profile', { credentials: 'include' });
                    const profData = await profResp.json();
                    if (profData.success) {
                        // Update cache and UI again with full details
                        localStorage.setItem('th_first_name', profData.user.firstName);
                        if (profData.user.profileImage) {
                            localStorage.setItem('th_avatar_url', profData.user.profileImage);
                        }
                        updateUserDisplay(profData.user);
                    }
                }
            } else {
                // Not authenticated: Clear sensitive predictive cache
                localStorage.removeItem('th_logged_in');
                localStorage.removeItem('th_first_name');
                localStorage.removeItem('th_avatar_url');
                localStorage.removeItem('th_user_email');
            }
        } catch (e) {
            // Not logged in or error, do nothing (default UI stays)
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalAuth);
    } else {
        initGlobalAuth();
    }
})();

// Inject CSS to ensure avatar images render as perfect circles
(function injectAvatarStyles() {
    const id = 'th-avatar-circle-fixes';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .profile-circle,
      .profile-dropdown .user-info .info-initials {
        overflow: hidden !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        border-radius: 50% !important;
        flex-shrink: 0 !important;          /* prevent flex from squashing */
        aspect-ratio: 1 / 1 !important;     /* keep perfect square */
        min-width: 36px !important;         /* ensure minimum size */
        min-height: 36px !important;
      }

      /* specific tweak for the small header circle */
      .profile-circle { min-width: 40px !important; min-height: 40px !important; }
    `;
    document.head.appendChild(style);
})();
