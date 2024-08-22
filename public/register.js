async function registerUser() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, firstName, lastName, password }),
    });

    const result = await response.json();
    const statusMessage = document.getElementById('statusMessage');

    if (response.ok) {
      statusMessage.textContent = 'Registration successful!';
      statusMessage.classList.remove('text-red-500');
      statusMessage.classList.add('text-green-500');
      window.location.href = '/login';
    } else {
      statusMessage.textContent = result.message || 'Registration failed!';
    }
  }