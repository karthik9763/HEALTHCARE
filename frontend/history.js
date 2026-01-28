const API_BASE = "http://127.0.0.1:4000/api";
if (sessionStorage.getItem("loggedIn") !== "true") window.location.href = "index.html";
async function load() {
    // Load Session Logs
    const res = await fetch(`${API_BASE}/history`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    // Sort by latest first
    data.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));

    const body = document.getElementById("historyBody");
    body.innerHTML = "";
    data.forEach(l => {
        const login = new Date(l.loginTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
        const logout = l.logoutTime ? new Date(l.logoutTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '<span class="status-badge status-log">Active Now</span>';
        body.innerHTML += `<tr><td>${login}</td><td>${logout}</td></tr>`;
    });

    // Load Health History
    const healthRes = await fetch('http://127.0.0.1:4000/api/health/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    });
    const healthData = await healthRes.json();
    const healthBody = document.getElementById("healthHistoryBody");
    healthBody.innerHTML = "";
    healthData.forEach(h => {
        const time = new Date(h.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
        healthBody.innerHTML += `<tr>
            <td>${time}</td>
            <td>${h.heartRate}</td>
            <td>${h.bp}</td>
            <td>${h.temperature}</td>
            <td>${h.oxygen}</td>
        </tr>`;
    });
}
load();
function logout() {
    const sid = localStorage.getItem("sessionId");
    fetch('http://127.0.0.1:4000/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid })
    }).then(() => {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "index.html";
    });
}
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") logout();
});
