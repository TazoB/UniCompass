document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

});

function logIn() {
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  if (email.value && password.value) {
    
    fetch('http://localhost:8080/register/getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
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
      window.location.href = '../QuestionsPage/questions.html';
    })
    .catch(error => {
      console.error('Error logging in:', error);
    });
  }
}

function signUp() {
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); 
    })
    .then(data => {
      // 1. Log the data to make sure it worked
      console.log('Sign up successful:', data); 
      
      // 2. Redirect the user
      window.location.href = '../QuestionsPage/questions.html';
    })
    .catch(error => {
      console.error('Error signing up:', error);
    });
  }
}