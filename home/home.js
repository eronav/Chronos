import { login, signup, showSignup, showLogin, signupCloseClicked, loginCloseClicked } from "/navbar/navbar.js";

let sections = document.querySelectorAll("section");
/*
window.onscroll = () => {
	sections.forEach(sec => {
		let top = window.scrollY;
		let offset = sec.offsetTop - 150;
		let height = sec.offsetHeight;

		if(top >= offset && top < offset + height){
			sec.classList.add("show-animate");
		}
		else{
			sec.classList.remove("show-animate");
		}
	})
}
*/

var taskLink = null;
var taskCard = null;
var calendarLink = null;
var calendarCard = null;
var pomodoroLink = null;
var pomodoroCard = null;
var journalLink = null;
var journalCard = null;
var resourcesLink = null;
var resourcesCard = null;

window.addEventListener("load", (e) => {
	taskLink = document.querySelector(".taskslink");
	taskCard = document.querySelector(".tasks");

	calendarLink = document.querySelector(".calendarlink");
	calendarCard = document.querySelector(".calendar");

	pomodoroLink = document.querySelector(".pomodorolink");
	pomodoroCard = document.querySelector(".pomodoro");

	journalLink = document.querySelector(".journallink");
	journalCard = document.querySelector(".journal");

	resourcesLink = document.querySelector(".resourceslink");
	resourcesCard = document.querySelector(".resources");

	taskLink.addEventListener('mouseenter', () => {
		taskCard.classList.add('active');
	});

	taskLink.addEventListener('mouseleave', () => {
		taskCard.classList.remove('active');
	});

	calendarLink.addEventListener('mouseenter', () => {
		calendarCard.classList.add('active');
	});

	calendarLink.addEventListener('mouseleave', () => {
		calendarCard.classList.remove('active');
	});

	pomodoroLink.addEventListener('mouseenter', () => {
		pomodoroCard.classList.add('active');
	});

	pomodoroLink.addEventListener('mouseleave', () => {
		pomodoroCard.classList.remove('active');
	});

	journalLink.addEventListener('mouseenter', () => {
		journalCard.classList.add('active');
	});

	journalLink.addEventListener('mouseleave', () => {
		journalCard.classList.remove('active');
	});

	resourcesLink.addEventListener('mouseenter', () => {
		resourcesCard.classList.add('active');
	});

	resourcesLink.addEventListener('mouseleave', () => {
		resourcesCard.classList.remove('active');
	});

	document.getElementById("login-btn").addEventListener("click", () => {
		login();
	});
	document.getElementById("signup-btn").addEventListener("click", () => {
		signup();
	});
	document.getElementById("login-close-btn").addEventListener("click", () => {
		loginCloseClicked();
	});
	document.getElementById("signup-close-btn").addEventListener("click", () => {
		signupCloseClicked();
	});
	document.getElementById("login-show-btn").addEventListener("click", () => {
		showLogin();
	});
	document.getElementById("signup-show-btn").addEventListener("click", () => {
		showSignup();
	});
});