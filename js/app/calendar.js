function loadCalendar(){
    $('#calendar-container').removeClass('hidden').addClass('show');
    $('#darken').removeClass('hidden').addClass('show');
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

//IF(due_date === currently rendering day)
//      Add a circle with colour of "status" to the elm

//DATA:
let a = {"exists":true,"tasks":[{"board_id":"eaaa5e12","is_top":true,"root_node_id":"8315231445","task_id":"8315231445","details":"Create the settings menus and databases","due_date":null,"parent_id":null,"status":1,"title":"Settings"},{"board_id":"eaaa5e12","is_top":true,"root_node_id":"8315326618","task_id":"8315326618","details":"Allow users to be invited to boards to work together","due_date":null,"parent_id":null,"status":0,"title":"Colaboration"},{"board_id":"eaaa5e12","is_top":true,"root_node_id":"8315522080","task_id":"8315522080","details":"-","due_date":null,"parent_id":null,"status":0,"title":"Set up servers and push"},{"board_id":"eaaa5e12","is_top":true,"root_node_id":"8317180897","task_id":"8317180897","details":"-","due_date":null,"parent_id":null,"status":1,"title":"Login and signup pages"},{"board_id":"eaaa5e12","is_top":true,"root_node_id":"8429355292","task_id":"8429355292","details":"Calendar.","due_date":"1578441600000","parent_id":null,"status":1,"title":"Calendar"},{"board_id":"eaaa5e12","is_top":true,"root_node_id":"8433792433","task_id":"8433792433","details":"-","due_date":null,"parent_id":null,"status":2,"title":"Comments fs8dg9fbvf"}],"id":"eaaa5e12"}
let b = {"8429355292":{"details":"Calendar.","title":"Calendar","is_top":true,"task_id":"8429355292","status":1,"parent_id":null,"due_date":"1578441600000"},"8538905000":{"details":"-","title":"Unnamed Task","is_top":false,"task_id":"8538905000","status":1,"parent_id":"8429355292","due_date":"1578441600000"}}
saveSess('taskDat', a);
saveSess('subTaskDat', b);
