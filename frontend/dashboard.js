const API_BASE = "http://127.0.0.1:4000/api";
//
if (sessionStorage.getItem("loggedIn") !== "true") {
    console.warn("[DASHBOARD] No active session found. Redirecting to login...");
    window.location.href = "index.html";
}
async function loadProfile() {
    try {
        const res = await fetch(`${API_BASE}/profile`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        const u = await res.json();
        document.getElementById("display-name").textContent = u.name || "Patient";
        document.getElementById("display-age").textContent = u.age || "--";
        document.getElementById("display-gender").textContent = u.gender || "--";
        document.getElementById("display-blood").textContent = u.bloodGroup || "--";
        localStorage.setItem("patientName", u.name);
    } catch (err) { console.error("Failed to load profile", err); }
}
loadProfile();

const socket = io(API_BASE.replace('/api', ''));

socket.on('healthUpdate', (data) => {
    document.getElementById("heart-rate").textContent = data.heartRate;
    document.getElementById("blood-pressure").textContent = data.bp;
    document.getElementById("temperature").textContent = data.temperature;
    document.getElementById("oxygen").textContent = data.oxygen;

    // Format time: HH:MM
    const date = new Date(data.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    document.getElementById("current-time").textContent = timeStr;

    // Check for abnormal readings (simple logic)
    if (data.heartRate > 100 || data.heartRate < 60) {
        document.querySelector('.metric-card.heart').style.animation = "pulse 1s infinite";
    } else {
        document.querySelector('.metric-card.heart').style.animation = "none";
    }
});

// Periodically save health data to database (every 30 seconds)
setInterval(async () => {
    const hr = document.getElementById("heart-rate").textContent;
    const bp = document.getElementById("blood-pressure").textContent;
    const temp = document.getElementById("temperature").textContent;
    const ox = document.getElementById("oxygen").textContent;

    if (hr === "0" || bp === "--/--") return;

    try {
        await fetch('http://127.0.0.1:4000/api/health', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                heartRate: parseInt(hr),
                bp: bp,
                temperature: parseFloat(temp),
                oxygen: parseInt(ox)
            })
        });
    } catch (err) { console.error("Failed to save health record", err); }
}, 30000);

async function logout() {
    const sid = localStorage.getItem("sessionId");
    await fetch('http://127.0.0.1:4000/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid })
    });
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "index.html";
}
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") logout();
});
