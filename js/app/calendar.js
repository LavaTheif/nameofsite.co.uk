function loadCalendar(){
    $('#calendar-container').removeClass('hidden').addClass('show');
    $('#darken').removeClass('hidden').addClass('show');
    setDisplay(dispMonth, dispYear);
}
function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}

function lastMonth(){
    dispMonth--;
    if(dispMonth < 0){
        dispMonth = 11;
        dispYear--;
    }
    setDisplay(dispMonth, dispYear);
}

function nextMonth(){
    dispMonth++;
    if(dispMonth > 11){
        dispMonth = 0;
        dispYear++;
    }
    setDisplay(dispMonth, dispYear);
}

function setDisplay(month, year) {
    let d = new Date();
    let currentDay = d.getDate();
    let currentMonth = d.getMonth();
    let currentYear = d.getYear()+1900;

    let meta = 1;//1== future, 0 == current, -1 == past
    if(month === currentMonth && year === currentYear)
        meta = 0;
    if((month < currentMonth && year === currentYear) || year < currentYear)
        meta = -1;

    let date = new Date(year, month, 1);
    let calendar = $('.calendar');
    let monthLength = daysInMonth(date.getMonth(), date.getYear());
    let day = date.getDay();
    if (!day) {
        day = 7;
    }
    day--;

    calendar.html(`<button onclick="lastMonth()">prev</button><div style="width: 555px" class="bar">${months[date.getMonth()]}, ${date.getFullYear()}</div><button onclick="nextMonth()">next</button>`);
    calendar.append(`<div class="bar">Monday</div><div class="bar">Tuesday</div><div class="bar">Wednesday</div>`);
    calendar.append(`<div class="bar">Thursday</div><div class="bar">Friday</div><div class="bar">Saturday</div>`);
    calendar.append(`<div class="bar">Sunday</div>`);

    //Set days from last month
    for (let i = 1; i <= day; i++) {
        calendar.append(`<div class="day" style="color: gray">Date: ${daysInMonth(date.getMonth() - 1, date.getYear()) - (day - (i))}</div>`)
    }

    let style = "";
    if(meta === -1){
        style = "background-color: lightgrey";
    }

    if(meta === 0){
        //Set current month
        for (let i = 1; i < currentDay; i++) {
            calendar.append(`<div class="day" id="${i}" style="background-color: lightgrey">Date: ${i}</div>`)
        }
        calendar.append(`<div class="day" id="${currentDay}" style="background-color: lightcoral">Date: ${currentDay}</div>`)
        for (let i = currentDay + 1; i <= daysInMonth(date.getMonth(), date.getYear()); i++) {
            calendar.append(`<div class="day" id="${i}" style="">Date: ${i}</div>`)
        }
    }else{
        for (let i = 1; i <= monthLength; i++) {
            calendar.append(`<div class="day" id="${i}" style="${style}">Date: ${i}</div>`)
        }
    }

    let blanks = 7-((monthLength+day)%7);
    if(blanks===7)
        return;

    for (let i = 1; i <= blanks; i++) {
        calendar.append(`<div class="day" style="color: grey;${style}">Date: ${i}</div>`)
    }


    //Render tasks
    let colours = ['task-red', 'task-yellow', 'task-green'];
    let tasks = getSessJSON('taskDat').tasks;
    for(let i = 0; i < tasks.length; i++){
        let d = tasks[i].due_date;
        if(!d)
            continue;
        let date = new Date(Number(d));

        if(date.getFullYear() === year && date.getMonth() === month){
            $('#'+date.getDate()).append('<div class="'+colours[tasks[i].status]+' blob"></div>');
        }
    }
    let subTasks = getSessJSON('subTaskDat');
    for(let i in Object.keys(subTasks)){
        let tsk = subTasks[Object.keys(subTasks)[i]];
        let d = tsk.due_date;
        if(!d)
            continue;
        let date = new Date(Number(d));

        if(date.getFullYear() === year && date.getMonth() === month){
            $('#'+date.getDate()).append('<div class="'+colours[tsk.status]+' blob"></div>');
        }
    }

}
