// Authentication check for protected pages
async function checkAuth(redirectToLogin = true) {
    try {
        const response = await fetch('/api/auth/session', {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.authenticated) {
            return data.user;
        } else if (redirectToLogin) {
            window.location.href = '/login.html';
            return null;
        }
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

// Update user display in header (if exists)
function updateUserDisplay(user) {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && user) {
        userNameElement.textContent = user.firstName;
    }

    // Also try to reflect avatar image and initials in any header avatar elements if present
    (async () => {
        try {
            const resp = await fetch('/api/auth/profile', { credentials: 'include' });
            const profile = await resp.json();
            if (profile && profile.success && profile.user) {
                applyHeaderAvatar(profile.user.profileImage, profile.user.firstName);
            }
        } catch (e) {
            // ignore avatar update failures on pages without header
        }
    })();
}

// Helper: apply avatar image to header elements if they exist
function applyHeaderAvatar(avatarUrl, firstName = '') {
    const profileCircle = document.getElementById('profileToggle');
    const userInitials = document.getElementById('userInitials');
    const dropdownInitials = document.getElementById('dropdownInitials');
    const initials = (firstName ? firstName.charAt(0) : 'U').toUpperCase();

    if (profileCircle) {
        if (avatarUrl) {
            profileCircle.style.backgroundImage = `url('${avatarUrl}')`;
            profileCircle.style.backgroundSize = 'cover';
            profileCircle.style.backgroundPosition = 'center';
        } else {
            profileCircle.style.backgroundImage = 'none';
        }
    }

    if (userInitials) {
        if (avatarUrl) {
            userInitials.textContent = '';
        } else {
            userInitials.textContent = initials;
        }
    }

    if (dropdownInitials) {
        if (avatarUrl) {
            dropdownInitials.style.backgroundImage = `url('${avatarUrl}')`;
            dropdownInitials.style.backgroundSize = 'cover';
            dropdownInitials.style.backgroundPosition = 'center';
            dropdownInitials.textContent = '';
        } else {
            dropdownInitials.style.backgroundImage = 'none';
            dropdownInitials.textContent = initials;
        }
    }
}

// Auto-apply header avatar on DOM ready across pages that include this script
(function () {
    async function fetchAndApplyAvatar() {
        try {
            // 1) Apply cached avatar immediately to avoid flicker/shift
            const cached = localStorage.getItem('th_avatar_url');
            if (cached) {
                applyHeaderAvatar(cached);
            }

            // 2) Fetch latest profile and update avatar/cache
            const resp = await fetch('/api/auth/profile', { credentials: 'include' });
            const profile = await resp.json();

            if (profile && profile.success && profile.user) {
                const url = profile.user.profileImage;
                const firstName = profile.user.firstName;

                if (url) {
                    localStorage.setItem('th_avatar_url', url);
                    applyHeaderAvatar(url, firstName);
                } else {
                    localStorage.removeItem('th_avatar_url');
                    applyHeaderAvatar(null, firstName);
                }
            }
        } catch (e) {
            // ignore if not logged in
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchAndApplyAvatar);
    } else {
        fetchAndApplyAvatar();
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
