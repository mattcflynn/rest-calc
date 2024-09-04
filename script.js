let breakSchedules = {};
let landingTime, flightDuration, breakEndTime;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, error => {
        console.log('ServiceWorker registration failed: ', error);
      });
    });
  }

function calculateBreaks() {
    const takeoffTimeInput = document.getElementById("takeoff-time").value;
    const flightDurationInput = document.getElementById("flight-duration").value;

    if (!validateInputs(takeoffTimeInput, flightDurationInput)) {
        alert("Please enter valid takeoff time and flight duration in the correct format.");
        return;
    }

    const takeoffTime = parseTime(takeoffTimeInput);
    flightDuration = parseDuration(flightDurationInput);

    landingTime = new Date(takeoffTime.getTime() + flightDuration.totalMinutes * 60000);

    const breakStart = 15; // 15 minutes after takeoff
    const breakEnd = 45;   // 45 minutes before landing
    const totalBreakTime = flightDuration.totalMinutes - (breakStart + breakEnd);

    if (totalBreakTime <= 0) {
        alert("Invalid total break time. Check your flight duration and input times.");
        return;
    }

    breakEndTime = new Date(landingTime.getTime() - breakEnd * 60000);

    // Three equal breaks
    const threeEqualBreaks = totalBreakTime / 3;
    const threeBreaks = calculateBreakScheduleFromEnd(breakEndTime, threeEqualBreaks, threeEqualBreaks, threeEqualBreaks);

    // Two equal breaks
    const twoEqualBreaks = totalBreakTime / 2;
    const twoBreaks = calculateBreakScheduleFromEnd(breakEndTime, twoEqualBreaks, twoEqualBreaks);

    // Short-Long-Short breaks
    const longBreak = totalBreakTime / 2;
    const shortBreak = longBreak / 2;
    const shortLongShortBreaks = calculateBreakScheduleFromEnd(breakEndTime, shortBreak, longBreak, shortBreak);

    // Short-Long-Long-Short breaks
    const shortBreak2 = totalBreakTime / 5;
    const longBreak2 = shortBreak2 * 1.5;
    const shortLongLongShortBreaks = calculateBreakScheduleFromEnd(breakEndTime, shortBreak2, longBreak2, longBreak2, shortBreak2);

    // Save schedules for adjustment
    breakSchedules = {
        "Three Equal Breaks": threeBreaks,
        "Two Equal Breaks": twoBreaks,
        "Short-Long-Short Breaks": shortLongShortBreaks,
        "Short-Long-Long-Short Breaks": shortLongLongShortBreaks
    };

    // Display results
    displayResults(breakSchedules);
}

function validateInputs(takeoffTime, flightDuration) {
    return /^\d{4}$/.test(takeoffTime) && /^\d{4}$/.test(flightDuration);
}

function parseTime(timeInput) {
    const hours = parseInt(timeInput.slice(0, 2), 10);
    const minutes = parseInt(timeInput.slice(2, 4), 10);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
}

function parseDuration(durationInput) {
    const hours = parseInt(durationInput.slice(0, 2), 10);
    const minutes = parseInt(durationInput.slice(2, 4), 10);
    return {
        hours: hours,
        minutes: minutes,
        totalMinutes: hours * 60 + minutes
    };
}

function calculateBreakScheduleFromEnd(endTime, ...breakDurations) {
    const breaks = [];
    let currentEndTime = endTime;

    for (let i = breakDurations.length - 1; i >= 0; i--) {
        const duration = breakDurations[i];
        const breakStart = new Date(currentEndTime.getTime() - duration * 60000);
        breaks.unshift({ start: breakStart, duration: duration });
        currentEndTime = breakStart;
    }

    return breaks;
}

function formatBreakSchedule(breaks) {
    return breaks.map((b, i) => {
        const endTime = new Date(b.start.getTime() + b.duration * 60000);
        const durationHours = Math.floor(b.duration / 60);
        const durationMinutes = Math.round(b.duration % 60);
        return `
            <p>Break ${i + 1}: Start - ${b.start.toISOString().substring(11, 16)} UTC, 
            End - ${endTime.toISOString().substring(11, 16)} UTC, 
            Duration - ${durationHours}h ${durationMinutes}m</p>
        `;
    }).join('');
}

function displayResults(schedules) {
    document.getElementById("results").innerHTML = `
        <h3>Landing Time: ${landingTime.toISOString().substring(11, 16)} UTC</h3>
        <h3>Three Equal Breaks:</h3>
        ${formatBreakSchedule(schedules["Three Equal Breaks"])}
        <h3>Two Equal Breaks:</h3>
        ${formatBreakSchedule(schedules["Two Equal Breaks"])}
        <h3>Short-Long-Short Breaks:</h3>
        ${formatBreakSchedule(schedules["Short-Long-Short Breaks"])}
        <h3>Short-Long-Long-Short Breaks:</h3>
        ${formatBreakSchedule(schedules["Short-Long-Long-Short Breaks"])}
    `;
}

function adjustBreakTimes(minutes) {
    if (!breakSchedules["Short-Long-Short Breaks"] || !breakSchedules["Short-Long-Long-Short Breaks"]) {
        return;
    }

    // Adjust Short-Long-Short breaks
    let shortLongShortBreaks = breakSchedules["Short-Long-Short Breaks"];
    let longDuration = shortLongShortBreaks[1].duration + minutes;
    let shortDuration = longDuration / 2;

    if (longDuration < 1 || shortDuration < 1) return; // Prevent negative or zero durations

    shortLongShortBreaks = calculateBreakScheduleFromEnd(
        breakEndTime,
        shortDuration, longDuration, shortDuration
    );

    // Adjust Short-Long-Long-Short breaks
    let shortLongLongShortBreaks = breakSchedules["Short-Long-Long-Short Breaks"];
    longDuration = shortLongLongShortBreaks[1].duration + minutes;
    shortDuration = longDuration / 1.5;

    if (longDuration < 1 || shortDuration < 1) return; // Prevent negative or zero durations

    shortLongLongShortBreaks = calculateBreakScheduleFromEnd(
        breakEndTime,
        shortDuration, longDuration, longDuration, shortDuration
    );

    // Save updated schedules
    breakSchedules["Short-Long-Short Breaks"] = shortLongShortBreaks;
    breakSchedules["Short-Long-Long-Short Breaks"] = shortLongLongShortBreaks;

    // Recalculate and display adjusted schedules
    displayResults(breakSchedules);
}
