const API_BASE = "http://127.0.0.1:4000/api";

async function signup() {
    const errorBox = document.getElementById("error-box");
    errorBox.style.display = "none";

    const n = document.getElementById("reg-name").value;
    const u = document.getElementById("reg-username").value;
    const e = document.getElementById("reg-email").value;
    const p = document.getElementById("reg-password").value;

    if (!n || !u || !e || !p) {
        showError("Please fill all fields.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: n, username: u, email: e, password: p })
        });

        const data = await res.json();

        if (res.ok) {
            // Instant Auto-Login
            sessionStorage.setItem("loggedIn", "true");
            localStorage.setItem("token", data.token);
            localStorage.setItem("patientName", data.name);
            localStorage.setItem("sessionId", data.sessionId);

            // Go to Dashboard
            window.location.href = "dashboard.html";
        } else {
            showError(data.message || "Signup failed");
        }
    } catch (err) {
        showError("Database is Offline. Please run START_DATABASE.bat first.");
    }
}

function showError(msg) {
    const box = document.getElementById("error-box");
    box.textContent = msg;
    box.style.display = "block";
}
