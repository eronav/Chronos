import { getAccounts, getTasks, getEvents, getJournals, addAccount } from "/firebase/firebase.js";

/*
<div class="logo">
	<a href="home.html"><img src="/assets/logofinal.png" alt="logo"></img></a>
</div>
<ul>
	<li><a href="#"><ion-icon name="checkmark-done-outline"></ion-icon>Tasks</a></li>
	<li><a href="#"><ion-icon name="calendar-outline"></ion-icon>Calendar</a></li>
	<li><a href="#"><ion-icon name="timer-outline"></ion-icon>Pomodoro</a></li>
	<li><a href="#"><ion-icon name="book-outline"></ion-icon>Journal</a></li>
	<li><a href="#"><ion-icon name="bulb-outline"></ion-icon>Resources</a></li>
</ul>
<button>Login</button>
*/

export var accountEmail = "";
var accountPassword = "";
var signedIn = false;

window.addEventListener("load", (e) => {
	let script1 = document.createElement("script");
	script1.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
	script1.type = "module";
	let script2 = document.createElement("script");
	script2.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
	script2.noModule = true;
	document.head.appendChild(script1);
	document.head.appendChild(script2);

	populateHeader();

	if (window.location.pathname.indexOf("home.html") != -1) {
		getAccounts();
	}

	accountEmail = localStorage.getItem("accountEmail");
	accountPassword = localStorage.getItem("accountPassword");
	if (accountEmail == null) {
		accountEmail = "";
	}
	if (accountPassword == null) {
		accountPassword = "";
	}
	if (accountEmail != "" && accountPassword != "") {
		setSignedIn(accountEmail, accountPassword);
	}
});

document.onclick = function(e) {
	e = e || window.event;
	var element = e.target;

	if (element.tagName == 'A' || element.tagName == "ION-ICON") {
		if (signedIn) {
			return true;
		}
		showLogin();
		return false; // prevent default action and stop event propagation
	}
};

function populateHeader() {
	var header = document.getElementsByClassName("navbar")[0]; // should only be one in each page

	let logo = document.createElement("div");
	logo.className = "logo";
	let logoLink = document.createElement("a");
	logoLink.href = "/home/home.html";
	let logoImg = document.createElement("img");
	logoImg.src = "/assets/finallogo.png";
	logoImg.alt = "logo";
	logoLink.appendChild(logoImg);
	logo.appendChild(logoLink);

	let labels = ["Tasks", "Calendar", "Pomodoro", "Journal", "Resources"];
	let links = ["/tasks/tasks.html", "/calendar/calendar.html", "/pomodoro/pomodoro.html", "/journal/journal.html", "/resources/resources.html"];
	let imgNames = ["checkmark-done-outline", "calendar-outline", "timer-outline", "book-outline", "bulb-outline"];
	let classNames = ["taskslink", "calendarlink", "pomodorolink", "journallink", "resourceslink"];
	let list = document.createElement("ul");
	for (let i = 0; i < labels.length; i++) {
		let item = document.createElement("li");
		item.classList.add(classNames[i]);
		let link = document.createElement("a");
		link.href = links[i];
		let icon = document.createElement("ion-icon");
		icon.name = imgNames[i];
		let text = document.createTextNode(labels[i]);
		link.appendChild(icon);
		link.appendChild(text);
		item.appendChild(link);
		list.appendChild(item);
	}

	let login = document.createElement("button");
	login.textContent = "Login";
	login.id = "account-btn";
	login.onclick = () => {
		if (signedIn) {
			setSignedOut();
			window.location.href = "/";
		} else {
			showLogin();
		}
	}

	header.appendChild(logo);
	header.appendChild(list);
	header.appendChild(login);
}

export function showSignup() {
	loginCloseClicked();
	document.getElementById("signup-error-message").style.opacity = 0;
	document.getElementById("signup-popup").classList.add("active");
}
export function showLogin() {
	signupCloseClicked();
	document.getElementById("login-error-message").style.opacity = 0;
	document.getElementById("login-popup").classList.add("active");
}
export function signupCloseClicked() {
	document.getElementById("signup-email").value = '';
	document.getElementById("signup-password").value = '';
	document.getElementById("signup-popup").classList.remove("active");
}
export function loginCloseClicked() {
	document.getElementById("login-email").value = '';
	document.getElementById("login-password").value = '';
	document.getElementById("login-popup").classList.remove("active");
}

function setSignedIn(email, password) {
	signedIn = true;
	accountEmail = email;
	accountPassword = password;
	localStorage.setItem("accountEmail", accountEmail);
	localStorage.setItem("accountPassword", accountPassword);
	document.getElementById("account-btn").textContent = "Sign Out";
	if (window.location.href.indexOf("home.html") != -1) {
		getTasks(accountEmail);
		getEvents(accountEmail);
		getJournals(accountEmail);
	}
}
function setSignedOut() {
	signedIn = false;
	accountEmail = "";
	accountPassword = "";
	localStorage.setItem("accountEmail", accountEmail);
	localStorage.setItem("accountPassword", accountPassword);
	document.getElementById("account-btn").textContent = "Login";
}
export function signup() {
	let email = document.getElementById("signup-email").value;
	let password = document.getElementById("signup-password").value;

	if (email == "" && password == "") {
		document.getElementById("signup-error-message").style.opacity = "1";
		document.getElementById("signup-password").innerHTML = '';
		return;
	}

	setSignedIn(email, password);
	addAccount(accountEmail, accountPassword);

	signupCloseClicked();
	loginCloseClicked();

}
export function login() {
	let email = document.getElementById("login-email").value;
	let password = document.getElementById("login-password").value;
	console.log(JSON.parse(localStorage.getItem("accounts")));
	if (JSON.parse(localStorage.getItem("accounts"))[email] == password) {
		// login successful
		setSignedIn(email, password);

		signupCloseClicked();
		loginCloseClicked();
	} else {
		// login failed
		//alert("Incorrect email or password");
		document.getElementById("login-error-message").style.opacity = "1";
		document.getElementById("login-password").innerHTML = '';
	}
}