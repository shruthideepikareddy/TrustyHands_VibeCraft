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

    // Also try to reflect avatar image in any header avatar elements if present
    (async () => {
        try {
            const resp = await fetch('/api/auth/profile', { credentials: 'include' });
            const profile = await resp.json();
            if (profile && profile.success && profile.user && profile.user.profileImage) {
                const avatarUrl = profile.user.profileImage;
                const profileCircle = document.getElementById('profileToggle');
                const userInitials = document.getElementById('userInitials');
                const dropdownInitials = document.getElementById('dropdownInitials');

                if (profileCircle) {
                    profileCircle.style.backgroundImage = `url('${avatarUrl}')`;
                    profileCircle.style.backgroundSize = 'cover';
                    profileCircle.style.backgroundPosition = 'center';
                }
                if (userInitials) {
                    userInitials.textContent = '';
                }
                if (dropdownInitials) {
                    dropdownInitials.style.backgroundImage = `url('${avatarUrl}')`;
                    dropdownInitials.style.backgroundSize = 'cover';
                    dropdownInitials.style.backgroundPosition = 'center';
                    dropdownInitials.textContent = '';
                }
            }
        } catch (e) {
            // ignore avatar update failures on pages without header
        }
    })();
}

// Helper: apply avatar image to header elements if they exist
function applyHeaderAvatar(avatarUrl) {
    const profileCircle = document.getElementById('profileToggle');
    const userInitials = document.getElementById('userInitials');
    const dropdownInitials = document.getElementById('dropdownInitials');

    if (profileCircle) {
        profileCircle.style.backgroundImage = `url('${avatarUrl}')`;
        profileCircle.style.backgroundSize = 'cover';
        profileCircle.style.backgroundPosition = 'center';
    }
    if (userInitials) {
        userInitials.textContent = '';
    }
    if (dropdownInitials) {
        dropdownInitials.style.backgroundImage = `url('${avatarUrl}')`;
        dropdownInitials.style.backgroundSize = 'cover';
        dropdownInitials.style.backgroundPosition = 'center';
        dropdownInitials.textContent = '';
    }
}

// Auto-apply header avatar on DOM ready across pages that include this script
(function () {
    async function fetchAndApplyAvatar() {
        try {
            // 1) Apply cached avatar immediately to avoid flicker/shift
            const cached = localStorage.getItem('th_avatar_url');
            if (cached) {
                // temporarily disable transition to avoid slide
                const el = document.getElementById('profileToggle');
                const prev = el ? el.style.transition : null;
                if (el) el.style.transition = 'none';
                applyHeaderAvatar(cached);
                // re-enable after a tick
                if (el) setTimeout(() => { el.style.transition = prev || ''; }, 50);
            }

            // 2) Fetch latest profile and update avatar/cache
            const resp = await fetch('/api/auth/profile', { credentials: 'include' });
            const profile = await resp.json();
            if (profile && profile.success && profile.user && profile.user.profileImage) {
                const url = profile.user.profileImage;
                localStorage.setItem('th_avatar_url', url);
                applyHeaderAvatar(url);
            }
        } catch (e) {
            // ignore if not logged in or endpoint unavailable on this page
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
