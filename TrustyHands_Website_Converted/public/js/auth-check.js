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
}
