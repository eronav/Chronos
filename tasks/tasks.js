import { getTasks, addTask, deleteAllTasks, completeTask, removeTask, db } from "/firebase/firebase.js";
import { ref, onChildChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { accountEmail } from "/navbar/navbar.js";

let rowHeight = '3rem';

const NEWEST = 0;
const PENDING = 1;
const COMPLETED = 2;
var filter = NEWEST;

var editing = "!-1";

window.addEventListener("load", (e) => {
	addPastTasks();

	document.getElementById("add-task-btn").addEventListener("click", () => {
		addNewTask();
	});
	document.getElementById("delete-all-btn").addEventListener("click", () => {
		deleteAllTasks();
		addPastTasks();
	});
	document.getElementById("filter-btn").addEventListener("click", () => {
		switchFilter();
	});
});

onChildChanged(ref(db, "tasks/" + accountEmail), (ss) => {
	getTasks(accountEmail);
});

function formatDate(date) {
	if (date == '') {
		return "No due date";
	}
	let comps = date.split("-");
	return `${comps[1]}/${comps[2]}/${comps[0]}`;
}

function addTaskToUI(date, idx) {
	// console.log(id);
	let tasks = JSON.parse(localStorage.getItem("tasks"));
	let table = document.getElementsByClassName("table-content")[0];
	let row = document.createElement("tr");
	row.style.height = rowHeight;
	// row.style.display = "table";

	let taskItem = document.createElement("td");
	let taskContainer = document.createElement("div");
	taskContainer.style.display = 'flex';
	taskContainer.style.alignContent = 'center';
	taskContainer.style.justifyContent = 'center';
	taskItem.style.textAlign = 'center';
	taskItem.textContent = tasks[date][idx]["name"];
	taskItem.appendChild(taskContainer);

	let dateItem = document.createElement("td");
	let dateContainer = document.createElement("div");
	dateContainer.style.display = 'flex';
	dateContainer.style.alignContent = 'center';
	dateContainer.style.justifyContent = 'center';
	dateItem.style.textAlign = 'center';
	dateItem.textContent = formatDate(date);
	dateItem.appendChild(dateContainer);

	let statusItem = document.createElement("td");
	let statusContainer = document.createElement("div");
	statusContainer.style.display = 'flex';
	statusContainer.style.alignContent = 'center';
	statusContainer.style.justifyContent = 'center';
	statusItem.style.textAlign = 'center';
	statusItem.textContent = tasks[date][idx]['status'].charAt(0).toUpperCase() + tasks[date][idx]['status'].slice(1);
	if (statusItem.textContent == "Completed") {
		row.classList.add("completed");
	} else {
		row.classList.add("pending");
	}
	statusItem.appendChild(statusContainer);

	row.appendChild(taskItem);
	row.appendChild(dateItem);
	row.appendChild(statusItem);

	// action buttons
	let actions = document.createElement("td");
	let actionContainer = document.createElement("div");
	actionContainer.style.display = 'flex';
	actionContainer.style.alignContent = 'center';
	actionContainer.style.justifyContent = 'center';

	let editBtn = document.createElement("button");
	editBtn.classList.add("action-btn");
	let editIcon = document.createElement("ion-icon");
	editIcon.name = "pencil-outline";
	editIcon.classList.add("action-icon");
	editBtn.name = `${date}!${idx}`;
	editBtn.appendChild(editIcon);
	editBtn.addEventListener("click", (e) => {
		let _date = e.currentTarget.name.split("!")[0];
		let _idx = parseInt(e.currentTarget.name.split("!")[1]);
		document.getElementById("task-input").value = tasks[_date][_idx]["name"];
		document.getElementById("date-input").value = _date;
		editing = e.currentTarget.name;
	});
	let completeBtn = document.createElement("button");
	completeBtn.classList.add("action-btn");
	let completeIcon = document.createElement("ion-icon");
	completeIcon.name = "checkmark-done-outline";
	completeIcon.classList.add("action-icon");
	completeBtn.name = `${date}!${idx}`;
	completeBtn.appendChild(completeIcon);
	completeBtn.addEventListener("click", (e) => {
		let _date = e.currentTarget.name.split("!")[0];
		let _idx = parseInt(e.currentTarget.name.split("!")[1]);
		completeTask(accountEmail, _date, _idx);
		addPastTasks();
	});
	let removeBtn = document.createElement("button");
	removeBtn.classList.add("action-btn");
	let removeIcon = document.createElement("ion-icon");
	removeIcon.name = "trash-outline";
	removeIcon.classList.add("action-icon");
	removeBtn.name = `${date}!${idx}`;
	removeBtn.appendChild(removeIcon);
	removeBtn.addEventListener("click", (e) => {
		let _date = e.currentTarget.name.split("!")[0];
		let _idx = parseInt(e.currentTarget.name.split("!")[1]);
		removeTask(accountEmail, _date, _idx);
		editing = "!-1";
		document.getElementById("task-input").value = "";
		document.getElementById("date-input").value = "";
		addPastTasks();
	});
	actionContainer.appendChild(editBtn);
	actionContainer.appendChild(completeBtn);
	actionContainer.appendChild(removeBtn);
	actions.appendChild(actionContainer);
	row.appendChild(actions);
	table.appendChild(row);
}

function addPastTasks() {
	let table = document.getElementsByClassName("table-content")[0];
	table.innerHTML = '';
	let tasks = JSON.parse(localStorage.getItem("tasks"));
	if (Object.keys(tasks).length == 0) {
		let txt = document.createElement("td");
		txt.colSpan = 4;
		txt.style.height = rowHeight;
		txt.style.textAlign = 'center';
		txt.textContent = "No tasks found";
		// console.log(txt);
		table.appendChild(txt);
	} else {
		// sort keys by reverse order
		let keys = Object.keys(tasks).sort();
		if (filter != NEWEST) {
			var completed = [];
			var pending = [];
			for (var keyIdx = 0; keyIdx < keys.length; keyIdx++) {
				let date = keys[keyIdx];
				for (var tIdx = 0; tIdx < tasks[date].length; tIdx++) {
					if (tasks[date][tIdx]['status'] == 'completed') {
						completed.push({ date: date, idx: tIdx });
					} else {
						pending.push({ date: date, idx: tIdx });
					}
				}
			}
			pending.sort((a, b) => {
				return (a.date <= b.date ? -1 : 1);
			});
			completed.sort((a, b) => {
				return (a.date <= b.date ? -1 : 1);
			});
			if (filter == PENDING) {
				for (var pIdx = 0; pIdx < pending.length; pIdx++) {
					addTaskToUI(pending[pIdx].date, pending[pIdx].idx);
				}
				for (var cIdx = 0; cIdx < completed.length; cIdx++) {
					addTaskToUI(completed[cIdx].date, completed[cIdx].idx);
				}
			} else {
				for (var cIdx = 0; cIdx < completed.length; cIdx++) {
					addTaskToUI(completed[cIdx].date, completed[cIdx].idx);
				}
				for (var pIdx = 0; pIdx < pending.length; pIdx++) {
					addTaskToUI(pending[pIdx].date, pending[pIdx].idx);
				}
			}
		} else {
			for (var keyIdx = 0; keyIdx < keys.length; keyIdx++) {
				let date = keys[keyIdx];
				for (var tIdx = 0; tIdx < tasks[date].length; tIdx++) {
					addTaskToUI(date, tIdx);
				}
			}
		}
	}
}

function addNewTask() {
	let taskName = document.getElementById("task-input").value;
	let dueDate = document.getElementById("date-input").value;
	addTask(accountEmail, taskName, dueDate, editing);
	addPastTasks();

	editing = "!-1";

	// clear input boxes
	document.getElementById("task-input").value = '';
	document.getElementById("date-input").value = '';
}

function switchFilter() {
	filter = (filter + 1) % 3;
	addPastTasks();
}

document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
	if (!button.classList.contains('delete')) {
		button.classList.add('delete');
		setTimeout(() => button.classList.remove('delete'), 3200);
	}
	e.preventDefault();
}));