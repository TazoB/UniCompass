document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();
});

// --- LOG IN FUNCTION ---
function logIn(event) {
  // 1. Stop the page from reloading
  if (event) event.preventDefault();

  const email = document.getElementById('email');
  const password = document.getElementById('password');

  if (email.value && password.value) {
    
    // 2. Changed to POST to match your Spring Boot @PostMapping
    fetch('http://localhost:8080/register/getUser', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      if(data === "User not found") {
        alert("No account found with that email. Please sign up first.");
        return;
      }
      // 3. Successful redirect
      window.location.href = '../QuestionsPage/questions.html';
    })
    .catch(error => {
      console.error('Error logging in:', error);
    });
  }
}

// --- SIGN UP FUNCTION ---
function signUp(event) {
  // 1. Stop the page from reloading
  if (event) event.preventDefault();

  const fullName = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  if (fullName.value && email.value && password.value) {
    fetch('http://localhost:8080/register/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: fullName.value,
        email: email.value,
        password: password.value
      })
    })
    .then(response => {
      // Your Java code returns badRequest() if user exists.
      // We handle that error here so it doesn't break the app.
      if (!response.ok) {
        return response.json().then(errData => {
            throw new Error(errData.error || 'Sign up failed');
        });
      }
      // Your Java code now returns a Map (JSON), so we parse it as JSON
      return response.json(); 
    })
    .then(data => {
      console.log('Sign up successful:', data.message); 
      // 2. Successful redirect
      window.location.href = '../QuestionsPage/questions.html';
    })
    .catch(error => {
      console.error('Error signing up:', error);
      alert(error.message); // Alerts "User with this email already exists"
    });
  }
} 