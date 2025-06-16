
let activeUnit = null; // 'hour', 'minutes', or 'seconds'
let inputValues = {
  hour: '',
  minutes: '',
  seconds: ''
};

// Handle selection of hour/minute/second buttons
document.querySelector('.hour-js').addEventListener('click', () => setActiveUnit('hour'));
document.querySelector('.minutes-js').addEventListener('click', () => setActiveUnit('minutes'));
document.querySelector('.seconds-js').addEventListener('click', () => setActiveUnit('seconds'));

function setActiveUnit(unit) {
  activeUnit = unit;
  // Highlight the active button
  document.querySelectorAll('.function-button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.${unit}-js`).classList.add('active');
}

// Handle number button clicks
document.querySelectorAll('.number-button').forEach(button => {
  button.addEventListener('click', () => {
    if (!activeUnit) return;

    const value = button.innerText.trim();
    if (value.toLowerCase() === 'del') {
      inputValues[activeUnit] = inputValues[activeUnit].slice(0, -1);
    } else {
      inputValues[activeUnit] += value;
    }

    // Update the display text on the selected unit button
    document.querySelector(`.${activeUnit}-js`).innerText = `${activeUnit}\n${inputValues[activeUnit]}`;
  });
});

// List of saved timers
const timersList = [];

function timersListRender() {
  let timersListHTML = '';
  timersList.forEach((timerObject, index) => {
    const { name, hour, minutes, seconds } = timerObject;
    const html = `
      <div class="timer-item" data-index="${index}">
        <div class="timer-name">${name}</div>
        <div class="timer-time js-timer-time">${hour}:${minutes}:${seconds}</div>
        <button class="delete-timer-button js-delete-timer-button">Delete</button>  
        <button class="start-timer-button js-start-timer-button">Start</button>
      </div>
    `;
    timersListHTML += html;
  });

  document.querySelector('.js-timers-list').innerHTML = timersListHTML;

  // Delete buttons
  document.querySelectorAll('.js-delete-timer-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        timersList.splice(index, 1);
        timersListRender();
      });
    });

  // Start buttons
  document.querySelectorAll('.js-start-timer-button').forEach((startButton, index) => {
    startButton.addEventListener('click', () => {
      const timer = timersList[index];
      const timerElement = startButton.closest('.timer-item');
      const display = timerElement.querySelector('.js-timer-time');

      let h = parseInt(timer.hour, 10);
      let m = parseInt(timer.minutes, 10);
      let s = parseInt(timer.seconds, 10);
      let originalTime = { h, m, s };
      let intervalId;

      function updateDisplay() {
        display.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }

      function tick() {
        if (h === 0 && m === 0 && s === 0) {
          clearInterval(intervalId);
          alert("Time's up!");
          return;
        }

        if (s > 0) {
          s--;
        } else {
          if (m > 0) {
            m--;
            s = 59;
          } else {
            if (h > 0) {
              h--;
              m = 59;
              s = 59;
            }
          }
        }

        updateDisplay();
      }

      // Start countdown
      intervalId = setInterval(tick, 1000);

      // Replace Start with Restart and Stop
startButton.outerHTML = `
  <button class="restart-button">Restart</button>
  <button class="pause-button">Pause</button>
`;

let isPaused = false;

// Set new buttons
const restartBtn = timerElement.querySelector('.restart-button');
let pauseBtn = timerElement.querySelector('.pause-button');

restartBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  h = originalTime.h;
  m = originalTime.m;
  s = originalTime.s;
  updateDisplay();
  intervalId = setInterval(tick, 1000);
  isPaused = false;
  pauseBtn.innerText = 'Pause';
});

pauseBtn.addEventListener('click', () => {
  if (!isPaused) {
    clearInterval(intervalId);
    isPaused = true;
    pauseBtn.innerText = 'Resume';
  } else {
    intervalId = setInterval(tick, 1000);
    isPaused = false;
    pauseBtn.innerText = 'Pause';
  }
});


      restartBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        h = originalTime.h;
        m = originalTime.m;
        s = originalTime.s;
        updateDisplay();
        intervalId = setInterval(tick, 1000);
      });

      stopBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        // Optionally reset UI:
        timersListRender(); // re-renders whole timer list
      });
    });
  });
}

  // Bind delete buttons
  document.querySelectorAll('.js-delete-timer-button')
    .forEach(button => {
      const index = parseInt(button.getAttribute('data-index'));
      button.addEventListener('click', () => {
        timersList.splice(index, 1);
        timersListRender(); // Re-render after deletion
      });
    });


// Add button event
document.querySelector('.add-js').addEventListener('click', () => {
  // Convert to numbers, default to 0 if empty
  let hour = parseInt(inputValues.hour || '0', 10);
  let minutes = parseInt(inputValues.minutes || '0', 10);
  let seconds = parseInt(inputValues.seconds || '0', 10);

  // Normalize time
  if (seconds >= 60) {
    minutes += Math.floor(seconds / 60);
    seconds = seconds % 60;
  }

  if (minutes >= 60) {
    hour += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  // Create timer name
  const name = `Timer ${timersList.length + 1}`;

  // Push formatted timer
  timersList.push({
    name,
    hour: hour.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  });

  // Clear input values
  inputValues = { hour: '', minutes: '', seconds: '' };

  // Reset UI
  document.querySelector('.hour-js').innerText = 'hour';
  document.querySelector('.minutes-js').innerText = 'minute';
  document.querySelector('.seconds-js').innerText = 'second';

  timersListRender();
});


// Reset button event
document.querySelector('.reset-js').addEventListener('click', () => {
  inputValues = { hour: '', minutes: '', seconds: '' };
  document.querySelector('.hour-js').innerText = 'hour';
  document.querySelector('.minutes-js').innerText = 'minute';
  document.querySelector('.seconds-js').innerText = 'second';
})

