document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const successMessage = document.getElementById('successMessage');
    // event listeners
    form.querySelectorAll("input").forEach(input => {
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        const eyeIcon = passwordToggle.querySelector('.eye-icon');
        passwordInput.type = isPassword ? 'text' : 'password';
        if (eyeIcon) {
            eyeIcon.classList.toggle('show-password', isPassword);
        }
        passwordInput.focus();
    });
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = document.getElementById("email").value.trim()
        if (email) {
            if (emailRegex.test(email)) {
                showSuccess("email");
            } else {
                showError("email", "Enter a Valid Email");
            }
        } else {
            showError("email", "Email Address is Required")
        }
    });
    passwordInput.addEventListener('input', () => {
        const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        const password = document.getElementById("password").value.trim()
        if (password) {
            if (password.length < 8) {
                showError("password", "Password Must be 8 Characters")
            } else {
                if (passwordRegex.test(password)) {
                    showSuccess("password")
                } else {
                    showError("password", "Password Must Contain An Uppercase, Lowercase, and Number")
                }
            }
        } else {
            showError("password", "Password is Required")
        }
    });
    // load animation
    const loginCard = form.closest('.login-card')
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateY(30px)';
    setTimeout(() => {
        loginCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateY(0)';
    }, 100);
    // functions
    function showError(fieldName, message) {
        const formGroup = document.getElementById(fieldName).closest('.form-group');
        const errorElement = document.getElementById(fieldName + 'Error');
        if (formGroup && errorElement) {
            formGroup.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
            const field = document.getElementById(fieldName);
            if (field) {
                field.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    field.style.animation = '';
                }, 500);
            }
        }
    }
    function showSuccess(fieldName) {
        const formGroup = document.getElementById(fieldName).closest('.form-group');
        const errorElement = document.getElementById(fieldName + 'Error');
        if (formGroup && errorElement) {
            formGroup.classList.remove('error');
            errorElement.classList.remove('show');
            setTimeout(() => {
                errorElement.textContent = '';
            }, 300);
        }
        const field = document.getElementById(fieldName);
        const wrapper = field?.closest('.input-wrapper');
        if (wrapper) {
            wrapper.style.borderColor = '#22c55e';
            setTimeout(() => {
                wrapper.style.borderColor = '';
            }, 2000);
        }
    }
});