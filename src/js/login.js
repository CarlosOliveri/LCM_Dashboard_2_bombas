//Script para inicio de sesion

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    fetch('http://localhost:1880/lcm/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        window.location.href = '/oapsa/inpet';
      } else {
        alert('Credenciales inválidas');
      }
    })
    .catch(err => {
      console.error(err);
    });
});