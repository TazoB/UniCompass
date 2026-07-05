document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const progressBar = document.getElementById('progress-bar');
    const displayBudget = document.getElementById('display-budget');
    const sliderBudget = document.getElementById('reg-budget');

    function validateStep(stepContainer) {
        let isValid = true;
        const requiredInputs = stepContainer.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#dc2626';
                setTimeout(() => input.style.borderColor = '', 2000);
            }
        });
        return isValid;
    }

    const btnNext1 = document.getElementById('btn-next-1');
    const emailInput = document.getElementById('reg-email');
    const usernameInput = document.getElementById('reg-username');

    btnNext1.addEventListener('click', async () => {
        if (validateStep(step1)) {

            const originalText = btnNext1.innerHTML;
            btnNext1.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Checking...`;
            lucide.createIcons();
            btnNext1.disabled = true;

            try {
                const email = encodeURIComponent(emailInput.value.trim());
                const username = encodeURIComponent(usernameInput.value.trim());
                const password = document.getElementById("reg-password").value.trim();

                const response = await fetch(`http://localhost:8080/api/auth/check-availability?email=${email}&username=${username}`);

                if (!response.ok) throw new Error("Failed to connect to server");

                const data = await response.json();

                let hasError = false;

                if (data.emailTaken) {
                    emailInput.style.borderColor = '#dc2626';
                    hasError = true;
                    document.getElementById("email-error").style.display = "block";
                } else document.getElementById("email-error").style.display = "none";

                if (data.usernameTaken) {
                    usernameInput.style.borderColor = '#dc2626';
                    hasError = true;
                    document.getElementById("username-error").style.display = "block";
                } else document.getElementById("username-error").style.display = "none";

                if(password.length < 8) {
                    document.getElementById("password-error").style.display = "block";
                    hasError = true;
                } else document.getElementById("password-error").style.display = "none";

                if (!hasError) {
                    step1.classList.remove('active');
                    step2.classList.add('active');
                    progressBar.style.width = '66.66%';
                }

            } catch (error) {
                console.error(error);
            } finally {
                btnNext1.innerHTML = originalText;
                btnNext1.disabled = false;
                lucide.createIcons();

                setTimeout(() => {
                    emailInput.style.borderColor = '';
                    usernameInput.style.borderColor = '';
                }, 3000);
            }
        }
    });

    document.getElementById('btn-next-2').addEventListener('click', () => {
        if (validateStep(step2)) {
            step2.classList.remove('active');
            step3.classList.add('active');
            progressBar.style.width = '100%';
        }
    });

    document.getElementById('btn-back-1').addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        progressBar.style.width = '33.33%';
    });

    document.getElementById('btn-back-2').addEventListener('click', () => {
        step3.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '66.66%';
    });

    sliderBudget.addEventListener('input', (e) => {
        displayBudget.textContent = Number(e.target.value).toLocaleString();
    });

    document.getElementById('btn-submit').addEventListener('click', async () => {
        if (validateStep(step3)) {

            const submitBtn = document.getElementById('btn-submit');
            submitBtn.innerHTML = `<i data-lucide="loader" class="icon-sm" style="animation: spin 1s linear infinite;"></i> Creating Account...`;
            lucide.createIcons();

            const newUser = {
                basics: {
                    fullName: document.getElementById('reg-fullname').value,
                    username: document.getElementById('reg-username').value,
                    email: document.getElementById('reg-email').value,
                    password: document.getElementById('reg-password').value
                },
                preferences: {
                    country: document.getElementById('reg-country').value,
                    city: document.getElementById('reg-city').value,
                    state: document.getElementById('reg-state').value,
                    budget: parseInt(document.getElementById('reg-budget').value),
                    poi: document.getElementById('reg-poi').value
                },
                academics: {
                    gpa: document.getElementById('reg-gpa').value,
                    sat: document.getElementById('reg-sat').value,
                    toefl: document.getElementById('reg-toefl').value,
                    ielts: document.getElementById('reg-ielts').value
                },
                languages: document.getElementById('reg-languages').value.split(',').map(s => s.trim()).filter(Boolean),
                skills: document.getElementById('reg-skills').value.split(',').map(s => s.trim()).filter(Boolean),
                extracurriculars: document.getElementById('reg-extras').value.split('\n').filter(Boolean)
            };

            try {
                const response = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                window.location.href = "profile.html";

            } catch (error) {
                submitBtn.innerHTML = `Complete Registration`;
            }
        }
    });
});