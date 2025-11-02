document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById("username")
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const successMessage = document.getElementById('successMessage');
    const loginButton = document.getElementsByClassName("login-btn")[0];
    // event listeners
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        const signupData = JSON.stringify({
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        })
        var loginReq = new XMLHttpRequest()
        loginReq.open("POST", "/v1/signup/api/postdata")
        loginReq.setRequestHeader("Content-Type", "application/json")
        loginReq.send(signupData)
        loginReq.onload = () => {
            if (loginReq.status == 201) {
                showNotification(loginReq.response, "success", form)
                setTimeout(() => {
                    window.location.href = "https://auth.sunkastudios.xyz"
                }, 3000)
            } else {
                showNotification(loginReq.response, "error", form)
            }
        }
    })
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
    usernameInput.addEventListener("input", () => {
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        const username = usernameInput.value.trim()
        if (username) {
            if (username.length >= 6) {
                if (usernameRegex.test(username)) {
                    showSuccess("username")
                } else {
                    showError("username", "Enter a Valid Username")
                }
            } else {
                showError("username", "Username must be 6 characters")
            }
        } else {
            showError("username", "Username is Required")
        }
    })
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
        loginButton.disabled = true
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
        loginButton.disabled = false
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
function showNotification(message, type = 'info', container = null) {
        const targetContainer = container || document.querySelector('form');
        if (!targetContainer) return;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let backgroundColor, borderColor, textColor;
        switch (type) {
            case 'error':
                backgroundColor = 'rgba(239, 68, 68, 0.1)';
                borderColor = 'rgba(239, 68, 68, 0.3)';
                textColor = '#ef4444';
                break;
            case 'success':
                backgroundColor = 'rgba(34, 197, 94, 0.1)';
                borderColor = 'rgba(34, 197, 94, 0.3)';
                textColor = '#22c55e';
                break;
            default:
                backgroundColor = 'rgba(6, 182, 212, 0.1)';
                borderColor = 'rgba(6, 182, 212, 0.3)';
                textColor = '#06b6d4';
        }
        
        notification.innerHTML = `
            <div style="
                background: ${backgroundColor}; 
                backdrop-filter: blur(10px); 
                border: 1px solid ${borderColor}; 
                border-radius: 12px; 
                padding: 12px 16px; 
                margin-top: 16px; 
                color: ${textColor}; 
                text-align: center;
                font-size: 14px;
                animation: slideIn 0.3s ease;
            ">
                ${message}
            </div>
        `;
        
        targetContainer.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
