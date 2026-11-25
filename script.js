
// DATABASE
let members = JSON.parse(localStorage.getItem("nsr_members")) || [];
let admins = JSON.parse(localStorage.getItem("nsr_admins")) || [];
let hiatus = JSON.parse(localStorage.getItem("nsr_hiatus")) || [];
let events = JSON.parse(localStorage.getItem("nsr_events")) || [];
let attendance = JSON.parse(localStorage.getItem("nsr_attendance")) || [];

function saveData() {
    localStorage.setItem("nsr_members", JSON.stringify(members));
    localStorage.setItem("nsr_admins", JSON.stringify(admins));
    localStorage.setItem("nsr_hiatus", JSON.stringify(hiatus));
    localStorage.setItem("nsr_events", JSON.stringify(events));
    localStorage.setItem("nsr_attendance", JSON.stringify(attendance));
    updateDashboard();
}

// NAVIGATION
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.querySelectorAll(".nav").forEach(n => {
        n.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    const nav = document.querySelector(`[data-page="${page}"]`);
    if (nav) nav.classList.add("active");

    const titles = {
        dashboard: "Dashboard",
        attendance: "Weekly Attendance",
        members: "Member Directory",
        profiles: "Member Profiles",
        hiatus: "Hiatus Forum",
        admins: "Administration",
        events: "Upcoming Events",
        game: "Spill or Drink"
    };

    document.getElementById("pageTitle").textContent = titles[page];
}

document.querySelectorAll(".nav").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// MODAL
function openModal(id) {
    if (id === "hiatusModal") updateMemberSelect();
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

// MEMBER
function addMember() {
    const name = document.getElementById("memberName").value.trim();

    if (!name) return alert("Nama member wajib diisi!");

    members.push({
        id: Date.now(),
        name,
        face: document.getElementById("memberFace").value,
        username: document.getElementById("memberUsername").value,
        role: document.getElementById("memberRole").value,
        photo: document.getElementById("memberPhoto").value,
        bio: document.getElementById("memberBio").value
    });

    saveData();
    renderMembers();
    closeModal("memberModal");

    document.querySelectorAll("#memberModal input, #memberModal textarea")
        .forEach(input => input.value = "");
}

function renderMembers() {
    const html = members.map(m => `
        <div class="member-card">
            <img class="member-photo"
                src="${safe(m.photo || 'https://placehold.co/400x400/171220/c9adff?text=NSR')}"
                onerror="this.src='https://placehold.co/400x400/171220/c9adff?text=NSR'">

            <div class="member-info">
                <h3>${safe(m.name)}</h3>
                <p>FACE CLAIM: ${safe(m.face || "-")}</p>
                <p>USERNAME: ${safe(m.username || "-")}</p>
                <p>POSITION: ${safe(m.role || "Member")}</p>

                <div class="member-actions">
                    <button class="small-btn" onclick="viewProfile(${m.id})">PROFILE</button>
                    <button class="small-btn" onclick="editMember(${m.id})">EDIT</button>
                    <button class="small-btn danger" onclick="deleteMember(${m.id})">DELETE</button>
                </div>
            </div>
        </div>
    `).join("");

    document.getElementById("memberList").innerHTML =
        html || "<p class='muted'>Belum ada member terdaftar.</p>";

    document.getElementById("profileList").innerHTML = html ||
        "<p class='muted'>Belum ada profil member.</p>";
}

function viewProfile(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;

    alert(
        "NIGHT SHADOW REBORN\n\n" +
        "Name: " + m.name +
        "\nFace Claim: " + m.face +
        "\nUsername: " + m.username +
        "\nPosition: " + m.role +
        "\n\nBiography:\n" + m.bio
    );
}

function editMember(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;

    const name = prompt("Nama member:", m.name);
    if (name === null || !name.trim()) return;

    m.name = name.trim();
    m.face = prompt("Face claim:", m.face) ?? m.face;
    m.username = prompt("Username:", m.username) ?? m.username;
    m.role = prompt("Position:", m.role) ?? m.role;
    m.bio = prompt("Biography:", m.bio) ?? m.bio;

    saveData();
    renderMembers();
}

function deleteMember(id) {
    if (!confirm("Hapus member ini?")) return;

    members = members.filter(m => m.id !== id);
    saveData();
    renderMembers();
}

// HIATUS
function updateMemberSelect() {
    document.getElementById("hiatusMember").innerHTML =
        members.map(m =>
            `<option value="${m.id}">${safe(m.name)}</option>`
        ).join("") || "<option value=''>Belum ada member</option>";
}

function addHiatus() {
    const id = Number(document.getElementById("hiatusMember").value);
    const member = members.find(m => m.id === id);

    if (!member) return alert("Pilih member terlebih dahulu!");

    hiatus.push({
        id: Date.now(),
        memberId: id,
        name: member.name,
        reason: document.getElementById("hiatusReason").value,
        duration: document.getElementById("hiatusDuration").value
    });

    saveData();
    renderHiatus();
    closeModal("hiatusModal");
}

function renderHiatus() {
    document.getElementById("hiatusList").innerHTML =
        hiatus.map(h => `
            <div class="hiatus-item">
                <div>
                    <h3>${safe(h.name)}</h3>
                    <p>${safe(h.reason)}</p>
                    <p>Duration: ${safe(h.duration)}</p>
                </div>
                <button class="small-btn danger" onclick="deleteHiatus(${h.id})">REMOVE</button>
            </div>
        `).join("") || "<p class='muted'>Belum ada member hiatus.</p>";
}

function deleteHiatus(id) {
    hiatus = hiatus.filter(h => h.id !== id);
    saveData();
    renderHiatus();
}

// ADMIN
function addAdmin() {
    const name = document.getElementById("adminName").value.trim();

    if (!name) return alert("Nama admin wajib diisi!");

    admins.push({
        id: Date.now(),
        name,
        position: document.getElementById("adminPosition").value,
        contact: document.getElementById("adminContact").value
    });

    saveData();
    renderAdmins();
    closeModal("adminModal");
}

function renderAdmins() {
    document.getElementById("adminList").innerHTML =
        admins.map(a => `
            <div class="member-card">
                <div class="member-info">
                    <h3>♛ ${safe(a.name)}</h3>
                    <p>POSITION: ${safe(a.position)}</p>
                    <p>CONTACT: ${safe(a.contact)}</p>
                    <button class="small-btn danger" onclick="deleteAdmin(${a.id})">REMOVE ADMIN</button>
                </div>
            </div>
        `).join("") || "<p class='muted'>Belum ada admin.</p>";
}

function deleteAdmin(id) {
    admins = admins.filter(a => a.id !== id);
    saveData();
    renderAdmins();
}

// EVENTS
function addEvent() {
    const name = document.getElementById("eventName").value.trim();

    if (!name) return alert("Nama event wajib diisi!");

    events.push({
        id: Date.now(),
        name,
        date: document.getElementById("eventDate").value,
        time: document.getElementById("eventTime").value,
        description: document.getElementById("eventDescription").value
    });

    saveData();
    renderEvents();
    closeModal("eventModal");
}

function renderEvents() {
    document.getElementById("eventList").innerHTML =
        events.map(e => `
            <div class="event-card">
                <div class="event-date">✦ ${safe(e.date || "DATE TBA")} | ${safe(e.time || "TIME TBA")}</div>
                <h3>${safe(e.name)}</h3>
                <p>${safe(e.description)}</p>
                <br>
                <button class="small-btn danger" onclick="deleteEvent(${e.id})">DELETE EVENT</button>
            </div>
        `).join("") || "<p class='muted'>Belum ada event mendatang.</p>";
}

function deleteEvent(id) {
    events = events.filter(e => e.id !== id);
    saveData();
    renderEvents();
}

// ATTENDANCE
function getWeek() {
    const date = new Date();
    const first = new Date(date.getFullYear(), 0, 1);
    return date.getFullYear() + "-W" +
        Math.ceil((((date - first) / 86400000) + first.getDay() + 1) / 7);
}

function markAttendance() {
    if (!members.length) return alert("Tambahkan member terlebih dahulu!");

    const name = prompt("Masukkan nama member yang ingin absen:");
    if (!name) return;

    const member = members.find(m =>
        m.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (!member) return alert("Member tidak ditemukan!");

    const today = new Date().toLocaleDateString("id-ID");
    const week = getWeek();

    if (attendance.some(a =>
        a.memberId === member.id &&
        a.date === today &&
        a.week === week
    )) {
        return alert("Member sudah absen hari ini!");
    }

    attendance.push({
        id: Date.now(),
        memberId: member.id,
        name: member.name,
        date: today,
        week
    });

    saveData();
    renderAttendance();
}

function renderAttendance() {
    const week = getWeek();

    const data = attendance.filter(a => a.week === week);

    document.getElementById("attendanceList").innerHTML =
        members.map(m => {
            const records = data.filter(a => a.memberId === m.id);

            return `
                <div class="attendance-item">
                    <div>
                        <strong>${safe(m.name)}</strong>
                        <p class="muted">${records.length} kali hadir minggu ini</p>
                    </div>
                    <span class="status">${records.length ? "● ACTIVE" : "○ NOT YET"}</span>
                </div>
            `;
        }).join("") || "<p class='muted'>Belum ada member.</p>";
}

// SPILL OR DRINK
const characters = [
    {
        name: "THE MYSTERIOUS ONE",
        role: "The Silent Observer",
        description: "Kamu adalah sosok yang tidak banyak bicara, tetapi selalu memperhatikan keadaan sekitar. Tidak semua orang mampu memahami isi pikiranmu. Kamu lebih suka mengamati sebelum mengambil keputusan."
    },
    {
        name: "THE GOLDEN CHILD",
        role: "The Charismatic Leader",
        description: "Kamu memiliki aura yang mudah menarik perhatian. Kehadiranmu membawa energi tersendiri bagi lingkungan sekitar. Kamu dikenal percaya diri, komunikatif, dan mampu memimpin suasana."
    },
    {
        name: "THE BROKEN ANGEL",
        role: "The Hidden Dreamer",
        description: "Di balik sikap tenang, kamu menyimpan banyak impian dan pemikiran. Kamu adalah sosok yang menghargai hal-hal kecil dan memiliki cara tersendiri dalam memandang dunia."
    },
    {
        name: "THE CHAOTIC SOUL",
        role: "The Unpredictable",
        description: "Tidak ada yang benar-benar bisa menebak apa yang akan kamu lakukan berikutnya. Kamu spontan, penuh ide, dan selalu berhasil membuat suasana menjadi lebih hidup."
    },
    {
        name: "THE DARK PRINCE",
        role: "The Elegant Strategist",
        description: "Kamu menyukai ketenangan, memiliki pemikiran yang terstruktur, dan selalu mempertimbangkan banyak hal sebelum bertindak. Elegan dalam bersikap, tegas dalam keputusan."
    },
    {
        name: "THE MOON CHILD",
        role: "The Gentle Soul",
        description: "Kamu dikenal sebagai pribadi yang hangat dan peduli. Kamu senang mendengarkan cerita orang lain dan sering menjadi tempat nyaman bagi orang-orang terdekat."
    },
    {
        name: "THE REBEL",
        role: "The Rule Breaker",
        description: "Kamu tidak suka terlalu dikekang oleh aturan yang tidak masuk akal. Kamu punya pendirian kuat, berani menyampaikan pendapat, dan memiliki identitas yang unik."
    },
    {
        name: "THE PHANTOM",
        role: "The Enigmatic Figure",
        description: "Kamu sulit ditebak dan jarang memperlihatkan seluruh sisi dirimu. Bagi sebagian orang, kamu adalah teka-teki yang menarik untuk dikenal lebih jauh."
    }
];

let currentCharacter = null;
let currentChoice = "";

function playGame(choice) {
    currentChoice = choice;

    const result = document.getElementById("gameResult");
    result.classList.remove("hidden");

    generateCharacter();

    result.scrollIntoView({ behavior: "smooth", block: "center" });
}

function generateCharacter() {
    let index = Math.floor(Math.random() * characters.length);

    currentCharacter = characters[index];

    document.getElementById("characterName").textContent =
        currentCharacter.name;

    document.getElementById("characterRole").textContent =
        currentCharacter.role;

    document.getElementById("characterDescription").textContent =
        currentCharacter.description;
}

function playGameAgain() {
    if (!currentChoice) return;
    generateCharacter();
}

function copyCharacter() {
    if (!currentCharacter) return;

    const text =
        "NIGHT SHADOW REBORN\n" +
        "SPILL OR DRINK: " + currentChoice + "\n\n" +
        "CHARACTER: " + currentCharacter.name + "\n" +
        "ROLE: " + currentCharacter.role + "\n\n" +
        currentCharacter.description;

    navigator.clipboard.writeText(text)
        .then(() => alert("Karakter berhasil disalin!"))
        .catch(() => alert("Tidak dapat menyalin teks."));
}

// SAFE TEXT
function safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[c]);
}

// DASHBOARD
function updateDashboard() {
    document.getElementById("totalMembers").textContent = members.length;
    document.getElementById("totalAdmins").textContent = admins.length;
    document.getElementById("totalHiatus").textContent = hiatus.length;

    const today = new Date().toISOString().slice(0, 10);

    document.getElementById("totalEvents").textContent =
        events.filter(e => !e.date || e.date >= today).length;
}

// INITIALIZE
function init() {
    updateDashboard();
    renderMembers();
    renderAdmins();
    renderHiatus();
    renderEvents();
    renderAttendance();
}

init();
              
