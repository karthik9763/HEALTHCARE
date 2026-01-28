const API_BASE = "http://127.0.0.1:4000/api";

async function login() {
    const u = document.getElementById("login-username").value;
    const p = document.getElementById("login-password").value;
    const errBox = document.getElementById("error-message");

    if (errBox) errBox.style.display = "none";

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });

        const data = await res.json();

        if (res.ok) {
            sessionStorage.setItem("loggedIn", "true");
            localStorage.setItem("token", data.token);
            localStorage.setItem("patientName", data.name);
            localStorage.setItem("sessionId", data.sessionId);
            window.location.href = "dashboard.html";
        } else {
            if (errBox) {
                errBox.textContent = data.message || "Invalid credentials";
                errBox.style.display = "block";
            } else {
                alert(data.message || "Invalid credentials");
            }
        }
    } catch (e) {
        if (errBox) {
            errBox.textContent = "Database Offline. Run START_DATABASE.bat!";
            errBox.style.display = "block";
        }
    }
}
