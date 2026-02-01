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
            // 1. Try to get user data from prediction/localStorage first for speed
            // (Optional optimization, skipping for reliability)

            // 2. Fetch fresh session/profile data
            const resp = await fetch('/api/auth/session', { credentials: 'include' });
            const data = await resp.json();

            if (data.authenticated && data.user) {
                // If logged in, update the entire header UI
                updateUserDisplay(data.user);

                // Also fetch full profile for avatar if needed (session usually has it, but /profile is richer)
                // The updateUserDisplay already used session data. 
                // We can do a secondary fetch for the full profile if 'profileImage' is missing or tailored data needed.
                if (!data.user.profileImage) {
                    const profResp = await fetch('/api/auth/profile', { credentials: 'include' });
                    const profData = await profResp.json();
                    if (profData.success) {
                        updateUserDisplay(profData.user);
                    }
                }
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
