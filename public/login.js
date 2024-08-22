async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const result = await response.json();

    if (response.ok && result.status === 'success') {
      localStorage.setItem('balance', result.data.balance.toString());
      localStorage.setItem('Authorization', result.data.token); // Store the JWT token
      statusMessage.textContent = 'Login successful!';
      statusMessage.classList.remove('text-red-500');
      statusMessage.classList.add('text-green-500');
      window.location.href = '/dashboard';
    } else {
      statusMessage.textContent = result.message || 'Login failed!';
    }
  }