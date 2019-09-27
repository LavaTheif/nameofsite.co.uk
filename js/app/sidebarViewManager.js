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
  updateSidebarView();
}


async function sideBarDetails(){
  let sidebarViewport = $('#mini-task-container');
  sidebarViewport.html(`<input id="board-name">
      <br>
      <br>
      <textarea id="board-desc"></textarea>`);
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
  sidebarViewport.html("<u style='position:sticky;'>Tasks</u>");
  if(mode === 0){
    renderSideBarTasksStage(1);
    renderSideBarTasksStage(2);
    renderSideBarTasksStage(3);
  }else{
    renderSideBarTasksStage(mode);
  }
}

function renderSideBarTasksStage(mode){
  let taskDat = getSessJSON('taskDat');
  let arr = taskDat.tasks;
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
    <div class="task ${colours[data.status]}" id="${data.task_id}" onclick="openTask('${data.task_id}')">
    <div class="task-name">${data.title}</div>
    <div class="task-desc">${data.details}</div>
    </div>
    `);

}

async function sideBarTasks(){
  let data = await get("board", {board_id: getUrlID()});
  if(!data.exists){
    menu(getSessJSON('boards'));
    alert("Board not found.");
    return;
  }
  saveSess('taskDat', data);
  updateSidebarFilter();
}

function sideBarSettings(){
  let sidebarViewport = $('#mini-task-container');
  sidebarViewport.html("Settings menu")

}
