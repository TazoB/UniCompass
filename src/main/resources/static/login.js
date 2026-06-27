document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    let generatedServerOTP = null;

    const viewLogin = document.getElementById('view-login');
    const viewForgotEmail = document.getElementById('view-forgot-email');
    const viewForgotVerify = document.getElementById('view-forgot-verify');
    const viewForgotNewPass = document.getElementById('view-forgot-new-pass');

    const loginBtn = document.getElementById('btn-login');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    const forgotEmailInput = document.getElementById('forgot-email');
    const otpInputs = document.querySelectorAll('.reset-otp');
    const newPassInput = document.getElementById('reset-new-password');
    const confirmPassInput = document.getElementById('reset-confirm-password');

    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    loginBtn.addEventListener('click', async () => {
        let isValid = true;
        if (!usernameInput.value.trim()) {
            usernameInput.style.borderColor = '#dc2626';
            isValid = false;
        }

        if (!passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#dc2626';
            isValid = false;
        }

        setTimeout(() => {
            usernameInput.style.borderColor = ''; passwordInput.style.borderColor = '';
        }, 2000);

        if (isValid) {
            loginBtn.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Logging in...`;
            lucide.createIcons();

            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: usernameInput.value.trim(),
                        password: passwordInput.value.trim()
                    })
                });

                if (!response.ok) {
                    throw new Error('Invalid email or password');
                }

                const data = await response.json();
                localStorage.setItem('jwt_token', data.token);
                window.location.href = "profile.html";

            } catch (error) {
                console.log(error);
                loginBtn.innerHTML = `Login`;
            }
        }
    });

    document.getElementById('link-forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        viewLogin.classList.remove('active');
        viewForgotEmail.classList.add('active');
    });

    document.getElementById('btn-back-to-login').addEventListener('click', () => {
        viewForgotEmail.classList.remove('active');
        viewLogin.classList.add('active');
    });

    const sendCodeBtn = document.getElementById('btn-send-code');
    sendCodeBtn.addEventListener('click', async () => {
        const emailVal = forgotEmailInput.value.trim();

        if (!emailVal || !emailVal.includes('@')) {
            forgotEmailInput.style.borderColor = '#dc2626';
            setTimeout(() => forgotEmailInput.style.borderColor = '', 2000);
            return;
        }

        const originalText = sendCodeBtn.innerHTML;
        sendCodeBtn.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Sending...`;
        lucide.createIcons();

        try {
            const response = await fetch('http://localhost:8080/api/email/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientEmail: emailVal })
            });

            if (!response.ok) throw new Error("Failed to send email");

            generatedServerOTP = await response.text();
            document.getElementById('display-reset-email').textContent = emailVal;
            viewForgotEmail.classList.remove('active');
            viewForgotVerify.classList.add('active');
            otpInputs[0].focus();

        } catch (error) {
            console.error(error);
        } finally {
            sendCodeBtn.innerHTML = originalText;
            lucide.createIcons();
        }
    });

    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    document.getElementById('link-resend-reset').addEventListener('click', async (e) => {
        e.preventDefault();

        const resendLink = e.target;
        const emailVal = forgotEmailInput.value.trim();

        if (!emailVal) {
            return;
        }

        resendLink.style.pointerEvents = 'none';
        resendLink.style.color = '#64748b';
        resendLink.textContent = "Sending...";

        try {
            const response = await fetch('http://localhost:8080/api/email/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientEmail: emailVal })
            });

            if (!response.ok) throw new Error("Failed to resend email");

            generatedServerOTP = await response.text();
            resendLink.style.color = '#16a34a';
            resendLink.textContent = "Code Sent!";
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();

        } catch (error) {
            console.error(error);
            resendLink.style.color = '#dc2626';
            resendLink.textContent = "Failed to send";
        } finally {
            setTimeout(() => {
                resendLink.style.pointerEvents = 'auto';
                resendLink.style.color = '#2563eb';
                resendLink.textContent = "Resend";
            }, 3000);
        }
    });

    const verifyCodeBtn = document.getElementById('btn-verify-code');
    verifyCodeBtn.addEventListener('click', () => {
        const code = Array.from(otpInputs).map(input => input.value).join('');

        if (code.length < 6) {
            otpInputs.forEach(input => {
                if (!input.value) {
                    input.style.borderColor = '#dc2626';
                    setTimeout(() => input.style.borderColor = '', 2000);
                }
            });
            return;
        }

        const originalText = verifyCodeBtn.innerHTML;
        verifyCodeBtn.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Verifying...`;
        lucide.createIcons();

        setTimeout(() => {
            if (code === generatedServerOTP) {
                viewForgotVerify.classList.remove('active');
                viewForgotNewPass.classList.add('active');
            } else {
                otpInputs.forEach(input => input.value = '');
                otpInputs[0].focus();
                verifyCodeBtn.innerHTML = originalText;
                lucide.createIcons();
            }
        }, 800);
    });

    const savePasswordBtn = document.getElementById('btn-save-password');
    savePasswordBtn.addEventListener('click', async () => {
        let isValid = true;
        const passVal = newPassInput.value.trim();
        const confirmVal = confirmPassInput.value.trim();
        const emailVal = forgotEmailInput.value.trim();

        if (!passVal) { newPassInput.style.borderColor = '#dc2626'; isValid = false; }
        if (!confirmVal) { confirmPassInput.style.borderColor = '#dc2626'; isValid = false; }

        if (passVal && confirmVal && passVal !== confirmVal) {
            newPassInput.style.borderColor = '#dc2626';
            confirmPassInput.style.borderColor = '#dc2626';
            isValid = false;
        }

        setTimeout(() => {
            newPassInput.style.borderColor = '';
            confirmPassInput.style.borderColor = '';
        }, 2000);

        if (isValid) {
            const originalText = savePasswordBtn.innerHTML;
            savePasswordBtn.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Resetting...`;
            lucide.createIcons();

            try {
                const response = await fetch('http://localhost:8080/api/auth/update-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailVal,
                        newPassword: passVal
                    })
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(errorMsg);
                }
                window.location.href = "login.html";

            } catch (error) {
                console.log(error);
                savePasswordBtn.innerHTML = originalText;
                lucide.createIcons();
            }
        }
    });

});