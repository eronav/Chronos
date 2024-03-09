import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
	getDatabase,
	set,
	update,
	remove,
	ref,
	child,
	onValue
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCEq92zD-uAY1NpV9pTH-usG2rLf0uzHks",
	authDomain: "chronos-f9b01.firebaseapp.com",
	projectId: "chronos-f9b01",
	storageBucket: "chronos-f9b01.appspot.com",
	messagingSenderId: "1037556018470",
	appId: "1:1037556018470:web:be7ee748caac4efec2a5e7",
	measurementId: "G-N0THJV2L0Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase();

var accounts = {};
var tasks = {};
var events = {};
var journals = [];

window.addEventListener("load", () => {
	let _accounts = localStorage.getItem("accounts");
	let _tasks = localStorage.getItem("tasks");
	let _events = localStorage.getItem("events");
	let _journals = localStorage.getItem("journals");
	if (_accounts != null) {
		accounts = JSON.parse(_accounts);
	}
	if (_tasks != null) {
		tasks = JSON.parse(_tasks);
	}
	if (_events != null) {
		events = JSON.parse(_events);
	}
	if (_journals != null) {
		journals = JSON.parse(_journals);
	}
});

export function getAccounts() {
	onValue(ref(db, "accounts"), (snapshot) => {
		accounts = snapshot.val();
		localStorage.setItem("accounts", JSON.stringify(accounts));
		console.log(accounts);
	});
}
export function addAccount(email, pass) {
	accounts[email] = pass;
	localStorage.setItem("accounts", accounts);
	set(ref(db, "accounts"), accounts);
}

export function getTasks(email) {
	onValue(ref(db, "tasks"), (snapshot) => {
		if (snapshot.val() != null) {
			if (snapshot.val()[email] != undefined) {
				tasks = snapshot.val()[email];
			} else {
				tasks = {};
			}
		} else {
			tasks = {};
		}
		localStorage.setItem("tasks", JSON.stringify(tasks));
	});
}
export function addTask(email, task, date, editing = "!-1") {
	let _date = editing.split("!")[0];
	let _idx = editing.split("!")[1];
	if (tasks[date] == undefined) {
		tasks[date] = [{ name: task, status: (_idx == -1 ? "pending" : tasks[_date][_idx]["status"]) }];
	} else {
		if (_idx != -1) {
			console.log("editing: " + _idx);
			tasks[_date][_idx]["name"] = task;
			console.log(tasks);
		} else {
			tasks[date].push({ name: task, status: "pending" });
		}
	}
	if (date != _date && _idx != -1) {
		removeTask(email, _date, _idx);
	}
	localStorage.setItem("tasks", JSON.stringify(tasks));
	set(ref(db, "tasks/" + email), tasks);
}
export function deleteAllTasks(email) {
	tasks = {};
	localStorage.setItem("tasks", JSON.stringify(tasks));
	set(ref(db, "tasks/" + email), tasks);
}
export function completeTask(email, date, idx) {
	tasks[date][idx]["status"] = (tasks[date][idx]["status"] == "pending" ? "completed" : "pending");
	localStorage.setItem("tasks", JSON.stringify(tasks));
	set(ref(db, "tasks/" + email), tasks);
}
export function removeTask(email, date, idx) {
	tasks[date].splice(idx, 1);
	if (tasks[date].length == 0) {
		// remove the key completely
		delete tasks[date];
	}
	localStorage.setItem("tasks", JSON.stringify(tasks));
	set(ref(db, "tasks/" + email), tasks);
}

export function getEvents(email) {
	onValue(ref(db, "events"), (snapshot) => {
		if (snapshot.val() != null) {
			if (snapshot.val()[email] != undefined) {
				events = snapshot.val()[email];
			} else {
				events = {};
			}
		} else {
			events = {};
		}
		localStorage.setItem("events", JSON.stringify(events));
	});
}
export function addEvent(email, event, date, start, end) {
	if (events[date] == undefined) {
		events[date] = [{ name: event, start: start, end: end }];
	} else {
		events[date].push({ name: event, start: start, end: end });
	}
	localStorage.setItem("events", JSON.stringify(events));
	set(ref(db, "events/" + email), events);
}
export function removeEvent(email, date, idx) {
	events[date].splice(idx, 1);
	if (events[date].length == 0) {
		delete events[date];
	}
	localStorage.setItem("events", JSON.stringify(events));
	set(ref(db, "events/" + email), events);
}

export function getJournals(email) {
	onValue(ref(db, "journals"), (snapshot) => {
		if (snapshot.val() != null) {
			if (snapshot.val()[email] != undefined) {
				journals = snapshot.val()[email];
			} else {
				journals = [];
			}
		} else {
			journals = [];
		}
		localStorage.setItem("journals", JSON.stringify(journals));
	});
}
export function addJournal(email, title) {
	journals.push({ title: title, message: "" });
	localStorage.setItem("journals", JSON.stringify(journals));
	set(ref(db, "journals/" + email), journals);
}
export function removeJournal(email, idx) {
	journals.splice(idx, 1);
	localStorage.setItem("journals", JSON.stringify(journals));
	set(ref(db, "journals/" + email), journals);
}
export function reorderJournals(email, idx) {
	let elem = journals[idx];
	journals.splice(idx, 1);
	journals.unshift(elem);
	localStorage.setItem("journals", JSON.stringify(journals));
	set(ref(db, "journals/" + email), journals);
}