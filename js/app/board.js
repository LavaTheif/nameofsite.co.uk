//menu({1:{'name':'test', 'id':'12345678'}, 2:{'name':'test 2', 'id':'12345679'}, 3:{'name':'LavaTheif\'s Test Board', 'id':'12345680'}})

function menu(boards){
    $('.layer-0').css('display', 'none');
    $('.layer-1').css('display', 'block');
    let select = $('#board-select');
    select.html("").scrollTop(0);
    if(!boards)
        return select.append("No Data");
    if(!boards[1])
        return select.append("No Data");

    for(let val in boards) {
        let id = boards[val]['id'];
        let name = boards[val]['name'];
        let desc = boards[val]['desc'];
        select.append(`<div class="board" id="${id}" onclick="selectBoard('${id}')">
          <div class="board-icon"></div>
          <p class="board-name">${fullySanitize(name)}</p>
          <p class="board-desc">${fullySanitize(desc)}</p>
        </div>`)
        let msg = "";
        let split = name.split(" ");
        for(let i = 0; i < split.length; i++){
            msg += split[i].charAt(0).toUpperCase();
            if(i===6)
                break;
        }
        $('#'+boards[val]['id']).children().eq(0).html("<br>"+fullySanitize(msg));
    }
    // console.log(boards)
}

//opens the board
function selectBoard(id) {
    if(!id)
        return;
    let taskID = getUrlTask();
    let data = getBoardData(id);
    if (!data) {
        menu(getSessJSON('boards'));
        alert("Board not found.");
        return;
    }

    window.history.pushState("", data.name, "?view=" + id);
    $('.layer-0').css('display', 'block');
    $('.layer-1').css('display', 'none');

    resetSidebar();

    $('#task-name').val("No task selected.").prop('disabled', true);
    $('#task-desc').val("No task selected.").prop('disabled', true);

    if(taskID){
        $('#board').val(1);
        updateSidebarView();
        openCategory(taskID);
    }
}

function getBoardData(id){
    if(!id){
        id = getUrlID();
    }
    let dataGlobal = getSessJSON('boards');
    let data = null;
    for(let val in dataGlobal){
        if(dataGlobal[val]['id'] === id){
            data = dataGlobal[val];
            break;
        }
    }
    return data;
}

function saveBoardData(id, json){
    if(!id){
        id = getUrlID();
    }
    if(!json)
        return;

    let dataGlobal = getSessJSON('boards');
    for(let val in dataGlobal){
        if(dataGlobal[val]['id'] === id){
            dataGlobal[val] = json;
            break;
        }
    }
    saveSess('boards', dataGlobal);
}

function createBoard(){
    get('createBoard').then(async (data) => {
        let boardDat = await get('userBoards');
        saveSess('boards', boardDat);
        selectBoard(data.id);
    })
}

//Save board details when input loses focus
function saveDetails(){
    let board_id = getUrlID();
    get('updateBoard', {board_id: board_id, board_name: $('#board-name').val(), board_desc: $('#board-desc').val()}).then((data) => {
        let name = data.board_name;
        let desc = data.board_desc;
        $('#board-name').val(name);
        $('#board-desc').val(desc);
        let boardData = getBoardData(board_id);
        boardData.name = name;
        boardData.desc = desc;
        saveBoardData(board_id, boardData);
    })
}


