var chatbotToggler = null;
var closeBtn = null;
var chatbox = null;
var chatInput = null;
var sendChatBtn = null;
var inputInitHeight = 0;

let userMessage = null; // Variable to store user's message
const API_KEY = "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"; // Paste your API key here

/*
<div class="chatbot-container">
	<button class="chatbot-toggler">
		<span class="material-symbols-rounded">mode_comment</span>
		<span class="material-symbols-outlined">close</span>
	</button>
	<div class="chatbot">
		<header>
			<h2>Chatbot</h2>
			<span class="close-btn material-symbols-outlined">close</span>
		</header>
		<ul class="chatbox">
			<li class="chat incoming">
				<span class="material-symbols-outlined">smart_toy</span>
				<p>Hi there 👋<br>How can I help you today?</p>
			</li>
		</ul>
		<div class="chat-input">
			<textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
			<span id="send-btn" class="material-symbols-rounded">send</span>
		</div>
	</div>
</div>
*/

window.addEventListener("load", (e) => {
	// add the necessary style tags
	let link1 = document.createElement("link");
	link1.rel = "stylesheet";
	link1.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";
	let link2 = document.createElement("link");
	link2.rel = "stylesheet";
	link2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0";

	document.head.appendChild(link1);
	document.head.appendChild(link2);

	populateChatbotContainer();
	chatbotToggler = document.querySelector(".chatbot-toggler");
	closeBtn = document.querySelector(".close-btn");
	chatbox = document.querySelector(".chatbox");
	chatInput = document.querySelector(".chat-input textarea");
	sendChatBtn = document.querySelector(".chat-input span");
	inputInitHeight = chatInput.scrollHeight;

	sendChatBtn.addEventListener("click", handleChat);
	closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
	chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

	chatInput.addEventListener("input", () => {
		// Adjust the height of the input textarea based on its content
		chatInput.style.height = `${inputInitHeight}px`;
		chatInput.style.height = `${chatInput.scrollHeight}px`;
	});

	chatInput.addEventListener("keydown", (e) => {
		// If Enter key is pressed without Shift key and the window 
		// width is greater than 800px, handle the chat
		if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
			e.preventDefault();
			handleChat();
		}
	});
});

function populateChatbotContainer() {
	let container = document.getElementsByClassName("chatbot-container")[0];

	let button = document.createElement("button");
	button.className = "chatbot-toggler";
	let span1 = document.createElement("span");
	span1.className = "material-symbols-rounded";
	span1.textContent = "mode_comment";
	let span2 = document.createElement("span");
	span2.className = "material-symbols-outlined";
	span2.textContent = "close";
	button.appendChild(span1);
	button.appendChild(span2);

	let chatbot = document.createElement("div");
	chatbot.className = "chatbot";
	let header = document.createElement("header");
	let title = document.createElement("h2");
	title.textContent = "Chatbot";
	let closer = document.createElement("span");
	closer.classList.add("material-symbols-outlined");
	closer.classList.add("close-btn");
	closer.textContent = "close";
	header.appendChild(title);
	header.appendChild(closer);

	let chatbox = document.createElement("ul");
	chatbox.className = "chatbox";
	let item = document.createElement("li");
	item.classList.add("chat");
	item.classList.add("incoming");
	let span = document.createElement("span");
	span.className = "material-symbols-outlined";
	span.textContent = "smart_toy";
	let desc = document.createElement("p");
	desc.textContent = "Hi there 👋\nHow can I help you today?";
	item.appendChild(span);
	item.appendChild(desc);
	chatbox.appendChild(item);

	let input = document.createElement("div");
	input.className = "chat-input";
	let textarea = document.createElement("textarea");
	textarea.placeholder = "Enter a message...";
	textarea.spellcheck = false;
	textarea.required = true;
	let sendBtn = document.createElement("span");
	sendBtn.id = "send-btn";
	sendBtn.className = "material-symbols-rounded";
	sendBtn.textContent = "send";
	input.appendChild(textarea);
	input.appendChild(sendBtn);

	chatbot.appendChild(header);
	chatbot.appendChild(chatbox);
	chatbot.appendChild(input);

	container.appendChild(button);
	container.appendChild(chatbot);
}

function createChatLi(message, className) {
	// Create a chat <li> element with passed message and className
	const chatLi = document.createElement("li");
	chatLi.classList.add("chat", `${className}`);
	let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
	chatLi.innerHTML = chatContent;
	chatLi.querySelector("p").textContent = message;
	return chatLi; // return chat <li> element
}

function generateResponse(chatElement) {
	const API_URL = "https://api.openai.com/v1/chat/completions";
	const messageElement = chatElement.querySelector("p");

	// Define the properties and message for the API request
	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${API_KEY}`
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: userMessage }],
		})
	}

	// Send POST request to API, get response and set the reponse as paragraph text
	fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
		messageElement.textContent = data.choices[0].message.content.trim();
	}).catch(() => {
		messageElement.classList.add("error");
		messageElement.textContent = "Oops! Something went wrong. Please try again.";
	}).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

function handleChat() {
	userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
	if (!userMessage) return;

	// Clear the input textarea and set its height to default
	chatInput.value = "";
	chatInput.style.height = `${inputInitHeight}px`;

	// Append the user's message to the chatbox
	chatbox.appendChild(createChatLi(userMessage, "outgoing"));
	chatbox.scrollTo(0, chatbox.scrollHeight);

	setTimeout(() => {
		// Display "Thinking..." message while waiting for the response
		const incomingChatLi = createChatLi("Thinking...", "incoming");
		chatbox.appendChild(incomingChatLi);
		chatbox.scrollTo(0, chatbox.scrollHeight);
		generateResponse(incomingChatLi);
	}, 600);
}