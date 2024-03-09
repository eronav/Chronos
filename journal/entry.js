var entry = {};

var titleField;
var contentField;

window.onload = () => {
	titleField = document.getElementById('title-field');
	contentField = document.getElementById('entry-field');

	entry = JSON.parse(localStorage.getItem("journals"))[0];

	console.log(entry);

	titleField.textContent = entry.title;
	contentField.value = entry.message;

	document.getElementById("submit-icon").addEventListener("click", () => {
		backToJournal();
	});
	document.getElementById("back-icon").addEventListener("click", () => {
		backToJournal();
	});
	document.getElementById("entry-field").addEventListener("keypress", (event) => {
		if (event.key === "Enter") {
			submitJournal();
		}
	})
};

function submitJournal() {
	var journals = JSON.parse(localStorage.getItem("journals"));
	journals[0].message = contentField.value;
	localStorage.setItem("journals", JSON.stringify(journals));
}

function backToJournal() {
	submitJournal();
	window.location.href = "/journal/journal.html";
}