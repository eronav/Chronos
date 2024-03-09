class PomodoroTimer {
	constructor(workTime = 25, breakTime = 5) {
		this.workTime = workTime;
		this.breakTime = breakTime;
		this.seconds = 0;
		this.currentMinute = this.workTime;
		this.interval = null;
		this.isWorkTime = true;
		this.paused = true;
		this.initDOM();
	}

	initDOM() {
		this.updateDisplay();
		document.getElementById('work').classList.add('active');
	}

	playChime() {
		const chime = document.getElementById('timerChime');
		if (chime) {
			chime.play().catch(error => console.error("Audio play failed:", error));
		} else {
			console.error("Chime element not found");
		}
	}

	switchMode() {
		this.isWorkTime = !this.isWorkTime;
		this.currentMinute = this.isWorkTime ? this.workTime : this.breakTime;
		this.seconds = 0;
		this.togglePanels();
		this.playChime();
		this.updateDisplay();
	}

	formatTime(time) {
		return time < 10 ? `0${time}` : time;
	}

	togglePanels() {
		const workPanel = document.getElementById('work');
		const breakPanel = document.getElementById('break');
		const circle = document.querySelector('.circle');
		if (this.isWorkTime) {
			workPanel.classList.add('active');
			breakPanel.classList.remove('active');
			circle.style.backgroundColor = 'var(--text)';
		} else {
			workPanel.classList.remove('active');
			breakPanel.classList.add('active');
			circle.style.backgroundColor = 'var(--thirdaccent)';
		}
	}

	updateDisplay() {
		document.getElementById('minutes').innerHTML = this.formatTime(this.currentMinute);
		document.getElementById('seconds').innerHTML = this.formatTime(this.seconds);
	}

	timerFunction() {
		if (!this.paused) {
			if (this.seconds === 0 && this.currentMinute === 0) {
				this.switchMode();
			} else {
				if (this.seconds === 0) {
					this.currentMinute--;
					this.seconds = 59;
				} else {
					this.seconds--;
				}
				this.updateDisplay();
			}
		}
	}

	start() {
		document.getElementById('start').style.display = "none";
		document.getElementById('pause').style.display = "inline-block";
		document.getElementById('reset').style.display = "inline-block";
		this.paused = false;
		if (!this.interval) {
			this.interval = setInterval(() => this.timerFunction(), 1000);
		}
	}

  reset() {
      clearInterval(this.interval); 
      this.interval = null;        
      this.currentMinute = this.workTime; 
      this.seconds = 0;                    
      this.isWorkTime = true;              
      this.paused = true;                  

      this.togglePanels();  
      this.updateDisplay();  

      document.getElementById('start').style.display = "inline-block";
      document.getElementById('pause').style.display = "none";
      document.getElementById('reset').style.display = "none";

      
      document.getElementById('pause').innerHTML = '<i class="fa-solid fa-pause"></i>';
  }

	togglePause() {
		this.paused = !this.paused;
		const pauseButton = document.getElementById('pause');
		pauseButton.innerHTML = this.paused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
	}

	updateTimes(newWorkTime, newBreakTime) {
		this.workTime = newWorkTime;
		this.breakTime = newBreakTime;
		this.currentMinute = this.isWorkTime ? this.workTime : this.breakTime;
		this.seconds = 0;
		this.updateDisplay();
		this.togglePanels();
	}
}

const pomodoroTimer = new PomodoroTimer();

document.getElementById('start').addEventListener('click', () => pomodoroTimer.start());
document.getElementById('pause').addEventListener('click', () => pomodoroTimer.togglePause());
document.getElementById('reset').addEventListener('click', (event) => {
    event.preventDefault(); 
    pomodoroTimer.reset();  
});


document.getElementById('settingsCog').addEventListener('click', () => {
	const modal = document.querySelector('.settings-modal');
	if (!modal) {
		const modalHtml = `
      <div class="settings-modal">
        <div>
          <label for="workTime">Work Time (minutes):</label>
          <input type="number" id="workTime" value="${pomodoroTimer.workTime}">
        </div>
        <div>
          <label for="breakTime">Break Time (minutes):</label>
          <input type="number" id="breakTime" value="${pomodoroTimer.breakTime}">
        </div>
        <button id="saveSettings">Save</button>
      </div>
    `;
		document.body.insertAdjacentHTML('beforeend', modalHtml);

		document.getElementById('saveSettings').addEventListener('click', () => {
			const newWorkTime = parseInt(document.getElementById('workTime').value, 10);
			const newBreakTime = parseInt(document.getElementById('breakTime').value, 10);
			if (!isNaN(newWorkTime) && !isNaN(newBreakTime)) {
				pomodoroTimer.updateTimes(newWorkTime, newBreakTime);
				document.querySelector('.settings-modal').classList.remove('active');
			}
		});
	} else {
		modal.classList.toggle('active');
	}
});

// document.getElementById('saveSettings').addEventListener('click', () => {
//   const newWorkTime = parseInt(document.getElementById('workTime').value, 10);
//   const newBreakTime = parseInt(document.getElementById('breakTime').value, 10);
//   if (!isNaN(newWorkTime) && !isNaN(newBreakTime)) {
//     pomodoroTimer.updateTimes(newWorkTime, newBreakTime);
//     document.querySelector('.settings-modal').style.display = 'none';
//   }
// });