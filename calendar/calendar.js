import { getEvents, getTasks, addEvent, removeEvent, db } from "/firebase/firebase.js";
import { ref, onChildChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { accountEmail } from "/navbar/navbar.js";

var calendar = null;
var date = null;
var daysContainer = null;
var prev = null;
var next = null;
var todayBtn = null;
var gotoBtn = null;
var dateInput = null;
var eventDay = null;
var eventDate = null;
var eventsContainer = null;
var addEventBtn = null;
var addEventWrapper = null;
var addEventCloseBtn = null;
var addEventTitle = null;
var addEventFrom = null;
var addEventTo = null;
var addEventSubmit = null;

let today = getFormattedDate(new Date());
let activeDay = today;

const months = [
	"\0",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const daysOfWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

// const eventsArr = {
// 	"2008-05-12": [
// 		{
// 			name: "event",
// 			start: "",
// 			end: ""
// 		},
// 		{
// 			name: "event",
// 			start: "",
// 			end: ""
// 		}
// 	]
// }

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

window.addEventListener("load", () => {
	calendar = document.querySelector(".calendar");
	date = document.querySelector(".date");
	daysContainer = document.querySelector(".days");
	prev = document.querySelector(".prev");
	next = document.querySelector(".next");
	todayBtn = document.querySelector(".today-btn");
	gotoBtn = document.querySelector(".goto-btn");
	dateInput = document.querySelector(".date-input");
	eventDay = document.querySelector(".event-day");
	eventDate = document.querySelector(".event-date");
	eventsContainer = document.querySelector(".events");
	addEventBtn = document.querySelector(".add-event");
	addEventWrapper = document.querySelector(".add-event-wrapper ");
	addEventCloseBtn = document.querySelector(".close ");
	addEventTitle = document.querySelector(".event-name ");
	addEventFrom = document.querySelector(".event-time-from ");
	addEventTo = document.querySelector(".event-time-to ");
	addEventSubmit = document.querySelector(".add-event-btn ");

	prev.addEventListener("click", prevMonth);
	next.addEventListener("click", nextMonth);

	todayBtn.addEventListener("click", () => {
		activeDay = today;
		initCalendar();
	});

	gotoBtn.addEventListener("click", gotoDate);

	// function to add event
	addEventBtn.addEventListener("click", () => {
		addEventWrapper.classList.toggle("active");
	});

	addEventCloseBtn.addEventListener("click", () => {
		addEventWrapper.classList.remove("active");
	});

	document.addEventListener("click", (e) => {
		if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
			addEventWrapper.classList.remove("active");
		}
	});

	// allow 50 chars in eventtitle
	addEventTitle.addEventListener("input", (e) => {
		addEventTitle.value = addEventTitle.value.slice(0, 60);
	});

	// function to add event to eventsArr
	addEventSubmit.addEventListener("click", () => {
		var eventTitle = addEventTitle.value;
		var eventTimeFrom = addEventFrom.value;
		var eventTimeTo = addEventTo.value;
		if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
			alert("Please fill all the fields");
			return;
		}

		addEvent(accountEmail, eventTitle, activeDay, eventTimeFrom, eventTimeTo);

		addEventWrapper.classList.remove("active");
		addEventTitle.value = "";
		addEventFrom.value = "";
		addEventTo.value = "";
		updateEvents(activeDay);
		// select active day and add event class if not added
		const activeDayEl = document.querySelector(".day.active");
		if (!activeDayEl.classList.contains("event")) {
			activeDayEl.classList.add("event");
		}
	});

	dateInput.addEventListener("input", (e) => {
		if (e.target.value.length == 0) {
			return;
		}
		if (e.inputType == "insertText") {
			if (!e.data.match(/[0-9]/)) {
				e.target.value = e.target.value.slice(0, -1);
				return;
			}
		} else if (e.inputType == "deleteContentBackward") {
			if (e.target.value.length == 2) {
				// delete last 2 chars
				e.target.value = e.target.value.slice(0, (e.target.value[0] == "0" ? -2 : -1));
				return;
			}
		}
		// inputted a number
		if (e.target.value.length == 2 || (e.target.value.length == 1 && parseInt(e.target.value) > 1)) {
			e.target.value = (e.target.value.length == 2 ? "" : "0") + e.target.value + "/";
		}
	});

	defineProperty();

	initCalendar();
});

onChildChanged(ref(db, "events/" + accountEmail), (snapshot) => {
	getEvents(accountEmail);
});
onChildChanged(ref(db, "tasks/" + accountEmail), (snapshot) => {
	getTasks(accountEmail);
});

// function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar(_year = null, _month = null) {
	daysContainer.innerHTML = '';
	let month = _month;
	let year = _year;
	if (month == null) {
		month = getMonthFromDate(activeDay);
		year = getYearFromDate(activeDay);
	}
	const firstDay = new Date(year, month - 1, 1);
	const lastDay = new Date(year, month, 0);
	const prevLastDay = new Date(year, month - 1, 0);
	const prevDays = prevLastDay.getDate();
	const lastDate = lastDay.getDate();
	const nextFirstDate = new Date(year, month, 1);
	const day = firstDay.getDay();
	const nextDays = 7 - lastDay.getDay() - 1;

	date.innerHTML = months[month] + " " + year;

	for (let x = day; x > 0; x--) {
		let prevDayDiv = document.createElement("div");
		prevDayDiv.textContent = prevDays - x + 1;
		prevDayDiv.classList.add("day", "prev-date");
		prevLastDay.setDate(prevDays - x + 1);
		prevDayDiv.name = getFormattedDate(prevLastDay);
		daysContainer.appendChild(prevDayDiv);
	}

	let events = JSON.parse(localStorage.getItem("events"));
	let tasks = JSON.parse(localStorage.getItem("tasks"));

	for (let i = 1; i <= lastDate; i++) {
		// check if event is present on that day
		let curDate = getFormattedDate(year, month, i);
		let eventPresent = false;
		if ((events[curDate] != undefined && events[curDate].length > 0) || (tasks[curDate] != undefined && tasks[curDate].length > 0)) {
			eventPresent = true;
		}
		var dayDiv = document.createElement("div");
		dayDiv.classList.add("day");
		dayDiv.name = curDate;
		dayDiv.textContent = i;
		if (curDate == activeDay) {
			setHeaderUI(curDate);

			updateEvents(curDate);
			if (eventPresent) {
				dayDiv.classList.add("today", "active", "event");
			} else {
				dayDiv.classList.add("today", "active");
			}
		} else {
			if (eventPresent) {
				dayDiv.classList.add("event");
			}
		}
		daysContainer.appendChild(dayDiv);
	}

	for (let j = 1; j <= nextDays; j++) {
		let postDayDiv = document.createElement("div");
		postDayDiv.textContent = j;
		postDayDiv.classList.add("day", "next-date");
		nextFirstDate.setDate(j);
		postDayDiv.name = getFormattedDate(nextFirstDate);
		daysContainer.appendChild(postDayDiv);
	}
	addListner();
}

// function to add month and year on prev and next button
function prevMonth() {
	let month = getMonthFromDate(activeDay);
	let year = getYearFromDate(activeDay);
	month--;
	if (month == 0) {
		month = 12;
		year--;
	}
	activeDay = getFormattedDate(year, month, 1);
	initCalendar();
}

function nextMonth() {
	let month = getMonthFromDate(activeDay);
	let year = getYearFromDate(activeDay);
	month++;
	if (month > 12) {
		month = 0;
		year++;
	}
	activeDay = getFormattedDate(year, month, 1);
	initCalendar();
}

// function to add active on day
function addListner() {
	const days = document.querySelectorAll(".day");
	days.forEach((day) => {
		day.addEventListener("click", (e) => {
			activeDay = e.target.name;
			setHeaderUI(e.target.name);
			updateEvents(e.target.name);
			// remove active
			days.forEach((day) => {
				day.classList.remove("active");
			});
			// if clicked prev-date or next-date switch to that month
			if (e.target.classList.contains("prev-date")) {
				// prevMonth();
				initCalendar();
				// add active to clicked day afte month is change
				setTimeout(() => {
					// add active where no prev-date or next-date
					const days = document.querySelectorAll(".day");
					days.forEach((day) => {
						if (
							!day.classList.contains("prev-date") &&
							day.name === e.target.name
						) {
							day.classList.add("active");
						}
					});
				}, 100);
			} else if (e.target.classList.contains("next-date")) {
				initCalendar();
				// add active to clicked day afte month is changed
				setTimeout(() => {
					const days = document.querySelectorAll(".day");
					days.forEach((day) => {
						if (
							!day.classList.contains("next-date") &&
							day.name === e.target.name
						) {
							day.classList.add("active");
						}
					});
				}, 100);
			} else {
				e.target.classList.add("active");
			}
		});
	});
}

function gotoDate() {
	const dateArr = dateInput.value.split("/");
	if (dateArr.length === 2) {
		if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
			activeDay = getFormattedDate(dateArr[1], dateArr[0], 1);
			initCalendar();
			return;
		}
	}
	alert("Invalid Date");
}

// function get active day day name and date and update eventday eventdate
function setHeaderUI(date) {
	eventDay.innerHTML = daysOfWeek[getDayFromDate(date)];
	eventDate.innerHTML = formatTagToDate(date);
}

// function update events when a day is active
function updateEvents(date) {
	let events = JSON.parse(localStorage.getItem("events"));
	let tasks = JSON.parse(localStorage.getItem("tasks"));

	var hasEvents = true;
	var hasTasks = true;

	if (events.length == 0 || events[date] == undefined) {
		let eventContent = document.createElement("div");
		eventContent.classList.add("no-event");
		let title = document.createElement("h3");
		title.textContent = "No Events";
		eventContent.appendChild(title);
		hasEvents = false;
		document.getElementsByClassName("event-section")[0].innerHTML = eventContent.outerHTML;
	}
	if (tasks.length == 0 || tasks[date] == undefined) {
		let taskContent = document.createElement("div");
		taskContent.classList.add("no-event");
		let title = document.createElement("h3");
		title.textContent = "No Tasks";
		taskContent.appendChild(title);
		hasTasks = false;
		document.getElementsByClassName("task-section")[0].innerHTML = taskContent.outerHTML;
	}

	if (hasEvents) {
		document.getElementsByClassName("event-section")[0].innerHTML = "";
	}
	for (let i = 0; hasEvents && i < events[date].length; i++) {
		let eventContent = document.createElement("div");
		eventContent.classList.add("event");
		let eventTitle = document.createElement("div");
		eventTitle.classList.add("title");
		let bulletPoint = document.createElement("i");
		bulletPoint.classList.add("fas");
		bulletPoint.classList.add("fa-circle");
		let titleText = document.createElement("h3");
		titleText.classList.add("event-title");
		titleText.textContent = events[date][i].name;
		eventTitle.appendChild(bulletPoint);
		eventTitle.appendChild(titleText);

		let eventTime = document.createElement("div");
		eventTime.classList.add("event-time");
		let eventTimeSpan = document.createElement("span");
		eventTimeSpan.classList.add("event-time");
		eventTimeSpan.textContent = formatTime(events[date][i].start) + " - " + formatTime(events[date][i].end);
		eventTime.appendChild(eventTimeSpan);

		let xBtn = document.createElement("button");
		xBtn.classList.add("x-btn");
		xBtn.textContent = "X";
		xBtn.style.zIndex = 1000;
		xBtn.name = i;

		eventContent.appendChild(eventTitle);
		eventContent.appendChild(eventTime);
		eventContent.appendChild(xBtn);

		eventContent.addEventListener("click", (e) => {
			if (e.target.tagName != "BUTTON") {
				return;
			}
			removeEvent(accountEmail, activeDay, parseInt(xBtn.name));
			updateEvents(activeDay);
		});

		document.getElementsByClassName("event-section")[0].appendChild(eventContent);
		// eventContent += `
		// <div class="event">
		// 	<div class="title">
		// 		<i class="fas fa-circle"></i>
		// 		<h3 class="event-title">${events[date][i].name}</h3>
		// 	</div>
		// 	<div class="event-time">
		// 		<span class="event-time">${}</span>
		// 	</div>
		// 	<button onclick="removeEvent()">x</button>
		// </div>`;
	}
	if (hasTasks) {
		document.getElementsByClassName("task-section")[0].innerHTML = "";
	}
	for (let i = 0; hasTasks && i < tasks[date].length; i++) {
		let taskContent = document.createElement("div");
		taskContent.classList.add("event");
		taskContent.classList.add("task");
		taskContent.cursor = "pointer";
		let taskTitle = document.createElement("div");
		taskTitle.classList.add("title");
		let bulletPoint = document.createElement("i");
		bulletPoint.classList.add("fas");
		bulletPoint.classList.add("fa-circle");
		let titleText = document.createElement("h3");
		titleText.classList.add("event-title");
		titleText.textContent = tasks[date][i].name;
		taskTitle.appendChild(bulletPoint);
		taskTitle.appendChild(titleText);
		taskContent.appendChild(taskTitle);

		taskContent.addEventListener("click", () => {
			window.location.href = "/tasks/tasks.html";
		});

		document.getElementsByClassName("task-section")[0].appendChild(taskContent);

		// taskContent += `
		// <div class="event">
		// 	<div class="title">
		// 		<i class="fas fa-circle"></i>
		// 		<h3 class="event-title">${tasks[date][i].name}</h3>
		// 	</div>
		// </div>`;
	}
}

function defineProperty() {
	var osccred = document.createElement("div");
	osccred.style.position = "absolute";
	osccred.style.bottom = "0";
	osccred.style.right = "0";
	osccred.style.fontSize = "10px";
	osccred.style.color = "#ccc";
	osccred.style.fontFamily = "sans-serif";
	osccred.style.padding = "5px";
	osccred.style.background = "#fff";
	osccred.style.borderTopLeftRadius = "5px";
	osccred.style.borderBottomRightRadius = "5px";
	osccred.style.boxShadow = "0 0 5px #ccc";
	document.body.appendChild(osccred);
}

function getFormattedDate(date, mo = null, da = null) {
	// date will be for year if mo and da are not null
	// format date object into string (yyyy-mm-dd)
	if (mo != null) {
		return (date + "-" + (mo > 9 ? mo : "0" + mo) + "-" + (da > 9 ? da : "0" + da));
	}
	return (date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()));
}
function getMonthFromDate(date) {
	return parseInt(date.split("-")[1]);
}
function getYearFromDate(date) {
	return parseInt(date.split("-")[0]);
}
function getDateFromDate(date) {
	return parseInt(date.split("-")[2]);
}
function getDayFromDate(date) {
	let day = getDateFromDate(date);
	let month = getMonthFromDate(date) + 10;
	if (month < 11) {
		month %= 12;
	}
	let year = getYearFromDate(date);
	let cent = Math.floor(year / 100);
	year = year % 100 - (month > 10 ? 1 : 0);

	let week = (day + Math.floor(2.6 * month - 0.2) - 2 * cent + year + Math.floor(year / 4) + Math.floor(cent / 4)) % 7;
	return week;
}
function formatTagToDate(date) {
	let comps = date.split("-");
	return (comps[1] + "/" + comps[2] + "/" + comps[0]);
}
function formatTime(time) {
	let hour = time.split(":")[0];
	let min = time.split(":")[1];
	let ampm = "AM";
	if (parseInt(hour) > 12) {
		ampm = "PM";
		hour = parseInt(hour) - 12;
		if (hour < 10) {
			hour = "0" + hour;
		} else {
			hour = "" + hour;
		}
	}
	return hour + ":" + min + " " + ampm;
}