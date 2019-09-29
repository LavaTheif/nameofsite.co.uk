async function loadData(){
  showOverlay($("#message-box-loading"));


  //get the url, remove everything up to and including the ? and then split it at every &
  let viewing = getUrlID();

  let userDat = await get('userData');
  // console.log(data);
  let boardDat = await get('userBoards');
  saveSess('boards', boardDat);
  saveSess('userDat', userDat);

  hideOverlay($("#message-box-loading"));//TODO: maybe before the if statement? idk
  if(!viewing)//if not viewing a board, open the page to let them choose a board
    menu(boardDat);
  else{
    selectBoard(viewing);
  }

}

async function openTask(id){
  let taskData = await get('subtasks');
  $('#task-name').val(taskData.tasks.title).prop('disabled', false);
  $('#task-desc').val(taskData.tasks.details).prop('disabled', false);

}

//menu({1:{'name':'test', 'id':'12345678'}, 2:{'name':'test 2', 'id':'12345679'}, 3:{'name':'LavaTheif\'s Test Board', 'id':'12345680'}})

function menu(boards){
  $('.layer-0').css('display', 'none');
  $('.layer-1').css('display', 'block');
  let select = $('#board-select');
  select.html("");
  if(!boards)
    return select.append("No Data");
  if(!boards[1])
    return select.append("No Data");

  for(let val in boards) {
    let id = boards[val]['id'];
    let name = boards[val]['name'];
    select.append(`<div class="board" id="${id}" onclick="selectBoard('${id}')">
          <div class="board-icon"></div>
          <p class="board-name">${name}</p>
        </div>`)
    let msg = "";
    let split = name.split(" ");
    for(let i = 0; i < split.length; i++){
      msg += split[i].charAt(0).toUpperCase();
      if(i===6)
        break;
    }
    $('#'+boards[val]['id']).children().eq(0).html("<br>"+msg);
  }
  // console.log(boards)
}

function saveSess(key, val){
  if(typeof val === typeof {}){
    val = JSON.stringify(val);
  }
  sessionStorage.setItem(key, val);
}

function getSess(key){
  return sessionStorage.getItem(key);
}
function getSessJSON(key){
  return JSON.parse(getSess(key));
}

//opens the board
function selectBoard(id){
  let data = getBoardData(id);
  if(!data){
    menu(getSessJSON('boards'));
    alert("Board not found.");
    return;
  }

  window.history.pushState("", data.name, "?view="+id);
  $('.layer-0').css('display', 'block');
  $('.layer-1').css('display', 'none');

  resetSidebar();

  $('#task-name').val("No task selected.").prop('disabled', true);
  $('#task-desc').val("No task selected.").prop('disabled', true);

}

function getUrlID(){
  let urlParams = window.location.href.replace(/.*\?/,"").split('&');
  let viewing;
  //check each of the paramaters
  for(let i = 0; i < urlParams.length; i++){
    let p = urlParams[i];
    //if it matches "view=" followed by an 8 digit ID, set the viewing variable to that id.
    if(p.match(/^view=[a-zA-Z0-9]{8}$/)){
      viewing = p.replace(/view=/,"");
    }
  }
  return viewing;
}

function getBoardData(id){
  if(!id){
    id = getUrlID();
  }
  let dataGlobal = getSessJSON('boards');
  let data;
  for(let val in dataGlobal){
    if(dataGlobal[val]['id'] === id){
      data = dataGlobal[val];
      break;
    }
  }
  return data;
}


//An object that is used to check if the console is opened.
let openConsole = function(){};
openConsole.toString = function(){
  this.opened = true;
}

//send the test message to console.  once it evaluates toString, we know the console has opened.
console.log("%c", openConsole);

//Check for when the console is opened
//We do this here, as opposed to in the toString function, as we want it to be at the bottom so the user sees it.
//Placing it in the function above will mean it is the first thing printed to the console.
let id = setInterval(function(){
  if(openConsole.opened){
    clearInterval(id);
    console.log('%cWarning! Do not paste code into here.', "color:red;font-size:25px;")
    console.log('%cIt can give attackers access to your personal data.', "color:darkred;font-size:20px;")
    console.log('%cIf you were told to paste something here, report the person immediately.\n> support@nameofsite.co.uk <', "color:#515151;font-size:16px;text-align:center;")
  }
}, 500);

// async function
// $(document).ready();

function alert(message){
  showOverlay($("#message-box"));
  $('#message-box-text').html(message);
}

function showOverlay(item){
  $('#darken').removeClass("hidden").addClass("show");
  item.removeClass("hidden").addClass("show");
}

function hideOverlay(btn){
  $('#darken').removeClass("show").addClass("hidden");
  $(btn).parent().removeClass("show").addClass("hidden");
}

function createCategory(){
  get('createCategory',{board_id: getUrlID()}).then((data) => {
    if(data.success)
      sideBarTasks();
    else
      alert(data.msg);
  })
}
function createBoard(){
  get('createBoard').then(async (data) => {
    let boardDat = await get('userBoards');
    saveSess('boards', boardDat);
    selectBoard(data.id);
  })
}