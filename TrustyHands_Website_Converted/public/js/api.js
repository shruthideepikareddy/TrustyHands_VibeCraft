// API configuration and helper functions
const API_BASE_URL = window.location.origin;

// API client with error handling
const api = {
    async post(endpoint, data, isFormData = false) {
        try {
            const options = {
                method: 'POST',
                credentials: 'include',
            };

            if (isFormData) {
                options.body = data;
            } else {
                options.headers = { 'Content-Type': 'application/json' };
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const result = await response.json();

            return result;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, errors: ['Network error. Please try again.'] };
        }
    },

    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }
};

// Display error messages
function showErrors(errors, containerId = 'error-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (errors && errors.length > 0) {
        container.innerHTML = errors.map(err =>
            `<p>${err}</p>`
        ).join('');
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// Display success message
function showSuccess(message, containerId = 'success-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="success-message">${message}</div>`;
    container.style.display = 'block';

    setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

// Clear all messages
function clearMessages() {
    const errorContainer = document.getElementById('error-container');
    const successContainer = document.getElementById('success-container');

    if (errorContainer) errorContainer.style.display = 'none';
    if (successContainer) successContainer.style.display = 'none';
}
