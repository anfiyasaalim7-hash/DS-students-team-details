// Firebase Config (Unga Project Details)
const firebaseConfig = {
    apiKey: "AIzaSyDTj0YPBuGawzSa_rv4urkuD49HHRD3XNE",
    authDomain: "student-c9edf.firebaseapp.com",
    databaseURL: "https://student-c9edf-default-rtdb.firebaseio.com",
    projectId: "student-c9edf",
    storageBucket: "student-c9edf.firebasestorage.app",
    messagingSenderId: "608489904489",
    appId: "1:608489904489:web:aa9f0f607e3ded1fb685f8"
};

// Start Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Generate 6 Member Input Fields Automatically
const container = document.getElementById('membersContainer');
for(let i=1; i<=6; i++) {
    const label = i === 1 ? "Member 1 (Team Leader)" : `Member ${i}`;
    container.innerHTML += `
        <div class="member-input">
            <h4>${label}</h4>
            <div class="input-row">
                <input type="text" id="m${i}_name" placeholder="Name" required>
                <input type="text" id="m${i}_roll" placeholder="Roll No" required>
                <input type="email" id="m${i}_mail" placeholder="College Email" required>
            </div>
        </div>
    `;
}

function openModal() { document.getElementById('formModal').style.display = 'flex'; }
function closeModal() { document.getElementById('formModal').style.display = 'none'; }

// Save Team to Cloud
document.getElementById('teamForm').addEventListener('submit', (e) => {
    e.preventDefault();
    let members = [];
    for(let i=1; i<=6; i++) {
        members.push({
            name: document.getElementById(`m${i}_name`).value,
            roll: document.getElementById(`m${i}_roll`).value,
            mail: document.getElementById(`m${i}_mail`).value
        });
    }
    db.ref('class_teams').push(members).then(() => {
        closeModal();
        document.getElementById('teamForm').reset();
        alert("Team Created Successfully!");
    });
});

// Load Teams in Real-time
db.ref('class_teams').on('value', (snapshot) => {
    const data = snapshot.val();
    const list = document.getElementById('teamsList');
    list.innerHTML = "";
    let count = 1;

    if(data) {
        Object.keys(data).forEach(id => {
            const team = data[id];
            let card = `<div class="team-card"><h3>Team ${count++}</h3>`;
            team.forEach((m, index) => {
                card += `
                    <div class="member-info">
                        <strong>${m.name}</strong> ${index === 0 ? '<span class="leader-tag">(LEADER)</span>' : ''}
                        <span>${m.roll} | ${m.mail}</span>
                    </div>
                `;
            });
            card += `<button onclick="deleteTeam('${id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.8rem; margin-top:10px;">Remove Team</button></div>`;
            list.innerHTML += card;
        });
    }
});

function deleteTeam(id) {
    if(confirm("Are you sure?")) db.ref('class_teams/' + id).remove();
}