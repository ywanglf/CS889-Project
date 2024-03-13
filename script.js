// var ProgressBar = require("progressbar.js")
const input = document.getElementById("input-box");
const list = document.getElementById("list-container");

function create() {
    if (input.value != "") {
        let li = document.createElement("li");
        let div = document.createElement("div");
        let span = document.createElement("span");

        var dateValue = document.getElementById('date-picker').value;
        var timeValue = document.getElementById('time-picker').value;
        var deadline = new Date(dateValue+'T'+timeValue);
        var now = new Date();
        var duration = deadline - now;

        span.className = "item-deadline";
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        span.innerHTML = formatter.format(deadline);

        div.className = "progress-container";
        div.id = "progress-container-"+now
        li.innerHTML = input.value;
        li.appendChild(span)
        li.appendChild(div);
        list.appendChild(li);

        initiateProgressBar(now, duration)
    }
}

function initiateProgressBar(now, duration) {
    var container = document.getElementById('progress-container-' + now);
    var bar = new ProgressBar.Line(container, {
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
        if(container.parentElement.classList == "checked") {
            bar.stop();
        }
    }
  });

  bar.animate(1.0)
}

list.addEventListener("click", function(e) {
    if (e.target.tagName == "LI") {
        e.target.classList.toggle("checked");
    }
})