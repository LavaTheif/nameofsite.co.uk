function updateSidebarView(){
  let val = $('#board').val()-0;
  switch(val){
    case 0:
      sideBarDetails();
      break;
    case 1:
      sideBarTasks();
      break;
    case 2:
      sideBarSettings();
      break;
    default:
      break;
  }
}

function updateSidebarFilter(){
  if($('#board').val() !== "1") return;
  let val = $('#filter').val()-0;
  renderSideBarTasks(val);
}

function resetSidebar(){
  $('#board').val(0);
  $('#filter').val(0);
  if(!getUrlTask())
    updateSidebarView();
  else
    openCategory(getUrlTask());
}

async function sideBarDetails(){
  let sidebarViewport = $('#mini-task-container');
  sidebarViewport.html(`<input id="board-name" maxlength="25" onfocusout="saveDetails()">
      <br>
      <br>
      <textarea id="board-desc" maxlength="252" onfocusout="saveDetails()"></textarea>`);
  let data = getBoardData();

  if(!data){
    let boardDat = await get('userBoards');
    saveSess('boards', boardDat);
    data = getBoardData();
  }

  $('#board-name').val(data.name);
  $('#board-desc').val(data.desc);

}

function renderSideBarTasks(mode){
  let sidebarViewport = $('#mini-task-container');
  // sidebarViewport.parent().append("<u style='position:sticky;'>Categories</u>");
  sidebarViewport.html("");
  if(mode === 0){
    let empty = renderSideBarTasksStage(1);
    if(empty)
        return;
    renderSideBarTasksStage(2);
    renderSideBarTasksStage(3);
  }else{
    renderSideBarTasksStage(mode);
  }
}

function renderSideBarTasksStage(mode){
  let taskDat = getSessJSON('taskDat');
  let arr = taskDat.tasks;
  if(arr.length === 0){
      $('#mini-task-container').append("<br><br><u>No data.</u>")
      return true;
  }
  for(let i in arr){
    let data = arr[i];
    if(mode === data.status+1)
      renderSideBarTask(data);
  }
}

function renderSideBarTask(data){
  let colours = ['task-red', 'task-yellow', 'task-green'];
  let sidebarViewport = $('#mini-task-container');

  sidebarViewport.append(`
    <div class="task ${colours[data.status]}" id="${data.task_id}" onclick="openCategory('${data.task_id}')">
    <div class="task-name"><b><u>${fullySanitize(data.title)}</u></b></div>
    <div class="comment-time">Due: ${!data.due_date?"N/A":new Date(Number(data.due_date)).toUTCString().replace(/00\:00.*$/, "")}</div>
    <div class="task-desc">${fullySanitize(data.details)}</div>
    </div>
    `);

  let category = $('#'+data.task_id);
  category.contextmenu(categoryContextMenu);
}

async function sideBarTasks(){
  let data = await get("board", {board_id: getUrlID()});
  saveSess('taskDat', data);
  updateSidebarFilter();
}

function sideBarSettings(){
  let sidebarViewport = $('#mini-task-container');
  sidebarViewport.html("Settings menu");
  sidebarViewport.append(`<div class="setting-container"><h1 class="setting-text">Open Invites</h1></div>`)
}
