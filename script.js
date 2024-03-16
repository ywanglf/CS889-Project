const task_description_input = document.getElementById("input-box");
const tasks_list = document.getElementById("list-container");

const getCurrentDate = () => {
    let currentDate = new Date();
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

const getLinearBar = (progressBarElement, duration) => {
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
    
    return bar;
}

const getCircularBar = (progressBarElement, duration) => {
    var bar = new ProgressBar.Circle(progressBarElement, {
        color: '#FFD580',
        strokeWidth: 8,
        trailWidth: 8,
        easing: 'easeInOut',
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
    
    return bar;
}

const create = () => {
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
        const progressBarElement = document.createElement("div");
        progressBarElement.className = `progress-bar-${currentMode}`;
        progressBarContainer.appendChild(progressBarElement);


        const task = document.createElement("li");
        task.innerHTML = task_description_input.value;
        task.appendChild(deadlineIndicator)
        task.appendChild(progressBarContainer);
        tasks_list.appendChild(task);

        startProgressBar(progressBarElement, duration)
    }
}

const Modes = {
    circular: "circular",
    linear: "linear"
}

const barFunctions = {
    [Modes.circular]: getCircularBar,
    [Modes.linear]: getLinearBar
}

var currentMode = Modes.circular;

const startProgressBar = (progressBarElement, duration) => {
    const bar = barFunctions[currentMode](progressBarElement, duration);
    bar.animate(1.0);
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
