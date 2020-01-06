async function createTask(parent){
    let boardID = getUrlID();
    let category = getUrlTask();
    if(!category)
        return;
    if(!parent)
        parent = category;

    await get('createSubtask', {board_id:boardID, root_id:category, parent_id: parent});
    renderTasks(category);
}

async function renderTasks(categoryID){
    let boardID = getUrlID();
    let taskArea = $('#subtasks');
    let top = taskArea.scrollTop();
    let left = taskArea.scrollLeft();
    taskArea.html("Loading Tasks...");
    let taskData = await get('subtasks', {board_id:boardID, task_id:categoryID});
    let subTaskJsonList = sortTaskData(taskData.taskData);
    let taskChildren = subTaskJsonList[categoryID].children;
    // console.log(taskData.taskData)
    // console.log(subTaskJsonList)

    taskArea.html("");
    taskArea.append("<div class='subtask-spacer-block'></div>")

    if(taskChildren){
        recursiveRenderTasks(taskChildren, taskArea);

        // taskArea.append('');
        // console.log(taskChildren);
    }else{
        //no sub tasks
        taskArea.html("There are no tasks for this category.");
    }

    taskArea.scrollTop(top);
    taskArea.scrollLeft(left);

    return subTaskJsonList; //saves us getting it elsewhere
}

function recursiveRenderTasks(childrenList, taskArea){
    for(let i = 0; i < childrenList.length; i++) {
        let task = childrenList[i];
        taskArea.append('<div class="subtask-box" id="task-box-' + task.task_id + '"></div>');
        let box = $('#task-box-' + task.task_id);
        if (taskArea.attr('id') === 'subtasks') {
            taskArea.append("<div class='subtask-spacer-block'></div>")
        } else if (childrenList.length > 1 && i !== childrenList.length - 1) {
            taskArea.append("<div class='subtask-spacer'></div>")
        }
        let colours = ['task-red', 'task-yellow', 'task-green'];
        // console.log(task);
        box.append(`<div id="task-${task.task_id}" class="subtask ${colours[task.status]}" onmouseenter="showHoverMenu('${task.task_id}')" onmouseleave="hideHoverMenu()">
<div id="task-info-${task.task_id}">
<h3><u>${fullySanitize(task.title)}</u></h3>
<div class="comment-time">Due: ${!task.due_date?"N/A":new Date(Number(task.due_date)).toUTCString().replace(/00\:00.*$/, "")}</div><br>
${fullySanitize(task.details).replace(/\n/g,"<br>")}<br><br>
</div>
</div>`)

        let taskElm = $('#task-'+task.task_id);
        taskElm.contextmenu(taskContextMenu);
        taskElm.click(function(){openSubtaskEditor(task.task_id)});

        if (task.children) {
            recursiveRenderTasks(task.children, box);
        }
    }
}


function showHoverMenu(task_id){
    let area = $('#subtask-hover');
    if(area.attr('id'))
        return;//If area already exists, do not add another one

    $('#task-'+task_id).append('<div id="subtask-hover">' +
        '<br>Name<br><input id="subtask-name" class="task-name-edit" onfocusout="saveSubtaskDetails()" maxlength="25"><br>' +
        '<br>Description<br><textarea id="subtask-desc" class="task-desc-edit" onfocusout="saveSubtaskDetails()" maxlength="252"></textarea>' +
        '</div>')

    // area = $('#subtask-hover');
    let data = getSessJSON('subTaskDat')[task_id];
    $('#subtask-name').val(data.title);
    $('#subtask-desc').val(data.details);
    $('#subtask-hover').click(function(e){e.stopPropagation()});
    // area.css('left',mouseX+"px");
    // area.css('top',mouseY+"px");
}

let closeOnSave = false;
function hideHoverMenu(){
    if(isInputSelected()){
        closeOnSave = true;
        return;
    }
    let area = $('#subtask-hover');
    closeOnSave = false;
    area.remove();
}

function openSubtaskEditor(task_id){
    //opens the editor that will offer options to delete a task, as well as provide additional settings such as status, and assigned users,
    showOverlay($('#sub-task-editor'));
    $('#current-task-id').attr('task_id', task_id);
    pullComments(task_id);

    let area = $('#subtask-due');
    let dateObj = new Date($('#task-info-'+task_id).children().eq(1).html().replace("Due: ",""));
    let date = dateObj.getFullYear()+"-";
    let m = dateObj.getMonth()+1;
    date+=(m < 10? "0"+m:m)+"-";
    let d = dateObj.getDate();
    date+=(d < 10? "0"+d:d);
    area.val(date);
    area.attr('onfocusout', 'updateDueDate('+task_id+', new Date($(this).val()).getTime())');
    //TODO: add in the settings stuff here.
}

function sortTaskData(list){
    let subTaskJsonList = {};
    for(let i = 0; i < list.length; i++){
        subTaskJsonList[list[i].task_id] = list[i];
    }
    saveSess("subTaskDat", subTaskJsonList);

    for(let i = list.length-1; i > 0; i--){
        let id = list[i].task_id;
        let elm = subTaskJsonList[id];
        if(subTaskJsonList[elm.parent_id]) {
            if (subTaskJsonList[elm.parent_id].children)
                subTaskJsonList[elm.parent_id].children.push(elm);
            else
                subTaskJsonList[elm.parent_id].children = [elm];
        }
        delete subTaskJsonList[id];
    }
    return subTaskJsonList;
}


//Save category details when input loses focus
function saveSubtaskDetails() {
    let task_id = $('#subtask-hover').parent().attr('id').replace("task-", "");
    get('updateSubtask', {
        board_id: getUrlID(),
        task_id: task_id,
        root_id: getUrlTask(),
        task_name: $('#subtask-name').val(),
        task_desc: $('#subtask-desc').val()
    }).then((data) => {
        let task = $('#task-info-' + task_id);
        task.html(`<h3><u>${fullySanitize(data.title)}</u></h3>
${fullySanitize(data.details).replace(/\n/g, "<br>")}<br><br>
`)
        let json = getSessJSON('subTaskDat');
        json[task_id].details = data.details;
        json[task_id].title = data.title;
        saveSess('subTaskDat', json);
        if (closeOnSave) {
            hideHoverMenu();
        }
    });
}

//Save category details when input loses focus
function saveSubtaskStatus(task_id, val) {
    let root = getUrlTask();
    if($('#'+task_id).length !== 0){
        root = task_id;
    }
    get('updateSubtaskStatus', {
        board_id: getUrlID(), task_id: task_id, root_id: root, status:
        val
    }).then((data) => {
        let colours = ['task-red', 'task-yellow', 'task-green'];
        let elm = $(((task_id-root)===0?"#":"#task-")+`${task_id}`);
        // console.log("task_id===getUrlTask() -> "+(task_id===getUrlTask()));      //false
        // console.log("task_id-getUrlTask() -> "+(task_id-getUrlTask()));          //0
        // console.log("task_id-getUrlTask()===0 -> "+((task_id-getUrlTask())===0));//true
        // console.log("task_id  getUrlTask() -> "+task_id+" " +getUrlTask());      //debug
        //??????
        //TODO: Write this better
        elm.removeClass('task-red').removeClass('task-yellow').removeClass('task-green');
        elm.addClass(colours[val]);
        //TODO: save to local storage
    });
}

function updateDueDate(task_id, val) {
    let root = getUrlTask();
    if(task_id === null){
        return;
    }else if($('#'+task_id).length !== 0){
        root = task_id;
    }
    get('updateDueDate', {
        board_id: getUrlID(), task_id: task_id, root_id: root, date:
        val
    }).then((data) => {
        $('#task-info-'+task_id).children().eq(1).html("Due: "+new Date(data.date).toUTCString().replace(/00\:00.*$/, ""));
        //TODO:
    });
}
