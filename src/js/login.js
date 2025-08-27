//Script para inicio de sesion
var SERVER = "localhost";
document.querySelector('.formulario').addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    fetch(`http://${SERVER}:1880/lcm/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    })
        .then(response => {
            console.log(response);
            return response.json();
        })
            .then(data => {
                console.log(data);
                if (data.status === 'ok') {
                    //console.log(data);
                    window.location.href = `http://${SERVER}:1880/lcm/index`;
                } else {
                    alert('Credenciales inválidas');
                }
            })
        .catch(err => {
            console.error(err);
        });
});