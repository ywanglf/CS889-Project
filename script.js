const tasks_list = document.getElementById("list-container");

const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
}

const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = String(currentDate.getHours() + 1).padStart(2, '0'); 
    return `${hours}:00`;
}

const showLinearBar = (progressBarElement, duration) => {
    const bar = new ProgressBar.Line(progressBarElement, {
        strokeWidth: 10,
        easing: 'linear',
        duration: duration,
        color: '#C2FD4F',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '93%', height: '100%' },
        text: {
            style: {
                color: '#BFBDBD',
                position: 'absolute',
                right: '0',
                top: '0px',
                padding: 0,
                margin: 0,
                transform: null
            },
            autoStyleContainer: false
        },
        from: {color: '#C2FD4F'},
        to: {color: '#F44C32'},
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            bar.setText(Math.round(bar.value() * 100) + ' %');
            if(progressBarElement.parentElement.classList == "checked") {
                bar.stop();
            }
        }
    });
    
    bar.animate(1.0);
}

const showCircularBar = (progressBarElement, duration) => {
    const bar = new ProgressBar.Circle(progressBarElement, {
        color: '#04D9FF',
        strokeWidth: 8,
        trailWidth: 8,
        easing: 'linear',
        duration: duration,
        text: {
          style: {
            color: '#aaa',
            position: 'absolute',
            left: '50%',
            top: '50%',
            padding: 0,
            margin: 0,
            transform: {
                prefix: true,
                value: 'translate(-50%, -50%)'
            }
          }
        },
        step: (state, circle) => {
            const value = Math.round(circle.value() * 100);
            if (value === 0) circle.setText('');
            else circle.setText(`${value}%`);
        }
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '1.5rem';
    
    bar.animate(1.0);
}

const showBombTimer = (progressBarElement, duration) => {
    let counter = duration / 1000;
    let countdownTimer = setInterval(() => {
        counter--;

        if (counter === (duration / 1000) - 1) {
          progressBarElement.style.animation = `
            burn ${duration / 1000}s steps(48) forwards`; 
        }
    
        if (counter < 1) {
          clearInterval(countdownTimer);
          progressBarElement.style.animation = 'explode 1s steps(8) forwards'; 
        }
    }, 1000); 
}

const showDownCounter = (progressBarElement, duration) => {
    const deadlineInUnixTime = Math.floor((duration + Date.now()) / 1000);
    const numOfPreviosDownCounters = document.querySelectorAll('[id^="flipdown-"]').length;
    const newCounterId = `flipdown-${numOfPreviosDownCounters}`;
    
    progressBarElement.id = newCounterId;
    progressBarElement.classList.add('flipdown');
    new FlipDown(deadlineInUnixTime, newCounterId).start();
}

const createTask = () => {
    const task_description_input = document.getElementById("input-box");

    if (task_description_input.value != "") {
        const dateValue = document.getElementById('date-picker').value;
        const timeValue = document.getElementById('time-picker').value;
        const deadlineDate = new Date(dateValue + 'T' + timeValue);
        const currentDate = new Date();
        const duration = deadlineDate - currentDate;

        const deadlineIndicator = document.createElement("span");
        deadlineIndicator.className = "item-deadline";
        const formatOptions = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        deadlineIndicator.innerHTML = new Intl.DateTimeFormat('en-US', formatOptions).format(deadlineDate);
        
        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "progress-bar-container";
        if (currentMode == Modes.bomb) {
            progressBarContainer.classList.add("fixHeight");
        }
        const progressBarElement = document.createElement("div");
        progressBarElement.className = `progress-bar-${currentMode}`;
        progressBarContainer.appendChild(progressBarElement);


        const task = document.createElement("li");
        task.innerHTML = task_description_input.value;
        task.appendChild(deadlineIndicator)
        task.appendChild(progressBarContainer);
        tasks_list.appendChild(task);
        
        drawAnimation(progressBarElement, duration)
    }
}

const Modes = {
    textual: "textual",
    circular: "circular",
    linear: "linear",
    bomb: "bomb",
    countdown: "countdown"
}

const animationFunctions = {
    [Modes.circular]: showCircularBar,
    [Modes.linear]: showLinearBar,
    [Modes.bomb]: showBombTimer,
    [Modes.countdown]: showDownCounter
}

let currentMode = Modes.countdown;

const drawAnimation = (progressBarElement, duration) => {
    animationFunctions[currentMode](progressBarElement, duration);
}

const changeMode = () => {
    const modeSelector = document.getElementById('mode-selector');
    currentMode = modeSelector.value;
}

tasks_list.addEventListener("click", (e) => {
    if (e.target.tagName == "LI") {
        e.target.classList.toggle("checked");
    }
})

document.getElementById("date-picker").value = getCurrentDate();
document.getElementById("time-picker").value = getCurrentTime();
document.getElementById('mode-selector').value = currentMode;
