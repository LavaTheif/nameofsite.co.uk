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
    data = await get("board")
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
    if(mode === data.stage+1)
      renderSideBarTask(data);
  }
}

function renderSideBarTask(data){
  let colours = ['task-red', 'task-yellow', 'task-green'];
  let sidebarViewport = $('#mini-task-container');

  sidebarViewport.append(`
    <div class="task ${colours[data.stage]}" id="${data.id}" onclick="openTask('${data.id}')">
    <div class="task-name">${data.name}</div>
    <div class="task-desc">${data.desc}</div>
    </div>
    `);

}

async function sideBarTasks(){
  let taskDat = await get('board');
  saveSess('taskDat', taskDat);
  updateSidebarFilter();
}

function sideBarSettings(){
  let sidebarViewport = $('#mini-task-container');
  sidebarViewport.html("Settings menu")

}
