const API_BASE = "http://127.0.0.1:4000/api";
if (sessionStorage.getItem("loggedIn") !== "true") window.location.href = "index.html";
async function load() {
    const res = await fetch(`${API_BASE}/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    });
    const u = await res.json();

    // Populate Form
    document.getElementById("pName").value = u.name || "";
    document.getElementById("pEmail").value = u.email || "";
    document.getElementById("pAge").value = u.age || "";
    document.getElementById("pGender").value = u.gender || "Male";
    document.getElementById("pBloodGroup").value = u.bloodGroup || "A+";

    // Populate View
    document.getElementById("view-pName").textContent = u.name || "--";
    document.getElementById("view-pEmail").textContent = u.email || "--";
    document.getElementById("view-pAge").textContent = u.age || "--";
    document.getElementById("view-pGender").textContent = u.gender || "--";
    document.getElementById("view-pBloodGroup").textContent = u.bloodGroup || "--";
}
load();

function toggleEdit(isEditing) {
    document.getElementById("profileView").style.display = isEditing ? "none" : "block";
    document.getElementById("profileForm").style.display = isEditing ? "block" : "none";
}

async function saveProfile() {
    const data = {
        name: document.getElementById("pName").value,
        email: document.getElementById("pEmail").value,
        age: document.getElementById("pAge").value,
        gender: document.getElementById("pGender").value,
        bloodGroup: document.getElementById("pBloodGroup").value
    };
    console.log("[PROFILE] Saving data:", data);

    const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        const u = await res.json();
        localStorage.setItem("patientName", u.name);

        const displayName = document.getElementById("display-name");
        if (displayName) displayName.textContent = u.name;

        // Refresh data and switch back to view mode
        await load();
        toggleEdit(false);

        const msg = document.getElementById("save-msg");
        msg.style.display = "block";
        setTimeout(() => { msg.style.display = "none"; }, 3000);
    } else {
        alert("Failed to save profile");
    }
}
function logout() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "index.html";
}
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") logout();
});
