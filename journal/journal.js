import { getJournals, addJournal, removeJournal, reorderJournals, db } from "/firebase/firebase.js";
import { ref, onChildChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { accountEmail } from "/navbar/navbar.js";

window.addEventListener("load", () => {
	// load journals from local storage
	showJournals();

	document.getElementById("add-journal-btn").addEventListener("click", () => {
		showModal();
	});
	document.getElementById("close-btn").addEventListener("click", () => {
		closeModal();
	});
	document.getElementById("set-title-btn").addEventListener("click", () => {
		setTitle();
	});
	document.getElementById("titleInput").addEventListener("keypress", (event) => {
		if (event.code == "Enter") {
			setTitle();
		}
	});
});

onChildChanged(ref(db, "journals/" + accountEmail), (snapshot) => {
	getJournals(accountEmail);
});

window.onclick = function(event) {
	var modal = document.getElementById('titleModal');
	if (event.target === modal) {
		modal.style.display = 'none';
	}
};

function closeModal() {
	document.getElementById("titleInput").value = "";
	document.getElementById('titleModal').style.display = 'none';
}

function createJournalButton(title, entryNumber) {
	var journalDiv = document.createElement('div');
	journalDiv.style.maxWidth = '12.5rem';
	journalDiv.style.marginRight = '5rem';
	journalDiv.style.marginBottom = '0rem';
	journalDiv.style.marginTop = '0rem';
	journalDiv.classList.add('journal');

	var journalImage = document.createElement('img');
	journalImage.src = '/assets/diary.png'; // Ensure the path to your image is correct
	journalImage.style.width = '120%';
	journalImage.style.opacity = '0.6';
	journalImage.alt = 'Journal';

	var journalTitle = document.createElement('div');
	var displayTitle = title;
	if (displayTitle.length > 21) {
		displayTitle = displayTitle.substring(0, 18);
		displayTitle += '...';
	}
	journalTitle.textContent = title;
	journalTitle.style.color = 'var(--text)';
	journalTitle.style.textAlign = 'left';
	journalTitle.style.fontSize = '2rem';
	journalTitle.style.marginTop = '0.5rem';
	journalTitle.style.marginLeft = '0.5rem';

	let journalX = document.createElement('button');
	journalX.style.background = "none";
	journalX.style.border = "none";
	journalX.innerHTML = '<img src=/assets/xmark.png>';
	journalX.style.width = '3rem';
	journalX.style.height = '3rem';
	journalX.style.position = "relative";
	journalX.style.zIndex = "1000";
	journalX.style.right = "5rem";
	journalX.style.bottom = "18rem";
	journalX.style.cursor = "pointer";

	journalX.addEventListener("click", function() {
		removeJournal(accountEmail, entryNumber);
		showJournals();
	});

	journalDiv.appendChild(journalImage);
	journalDiv.appendChild(journalTitle);
	journalDiv.appendChild(journalX);

	journalImage.style.cursor = "pointer";

	journalDiv.id = entryNumber;
	journalImage.id = entryNumber;

	journalImage.addEventListener("click", () => {
		openEntry(journalImage.id);
		return;
	});

	document.getElementById('journals-container').appendChild(journalDiv);
}

function openEntry(entryNumber) {
	document.getElementById('titleModal').style.display = 'none';
	document.getElementById('titleInput').value = ''; // Clear the input field
	reorderJournals(accountEmail, entryNumber);
	window.location.href = "/journal/entry.html";
}
function showModal() {
	document.getElementById('titleModal').style.display = 'block';
	document.getElementById("titleInput").focus();
}
function setTitle() {
	var userInput = document.getElementById('titleInput').value;
	if (userInput.trim() !== '') {
		addJournal(accountEmail, userInput);
		showJournals();
		let journals = JSON.parse(localStorage.getItem("journals"));
		openEntry(journals.length - 1);
	}
}

function showJournals() {
	// load all journals
	let journals = JSON.parse(localStorage.getItem("journals"));
	document.getElementById('journals-container').innerHTML = '';
	for (var i = 0; i < journals.length; i++) {
		createJournalButton(journals[i]["title"], i);
	}
}