//Key listeners
//TODO: factorise this.

let arrow_last = 0;


function openShortcutHelp(){
    let elm = $('#shortcut-help');
    elm.removeClass('hidden').addClass('show');
}
function closeShortcutHelp(){
    let elm = $('#shortcut-help');
    let elm2 = $('#sub-task-editor');
    let elm3 = $('#calendar-container');
    let darken = $('#darken');
    if(elm.hasClass('show'))
        elm.removeClass('show').addClass('hidden');
    else if(elm2.hasClass('show')){
        elm2.removeClass('show').addClass('hidden');
        darken.removeClass('show').addClass('hidden');
    }else if(elm3.hasClass('show')){
        elm3.removeClass('show').addClass('hidden');
        darken.removeClass('show').addClass('hidden');
    }
    else
        selectBoard(getUrlID());
}

//Check if a key is pressed and is unevaluated
function keypress(key){
    let keyCode = charCodeOf(key);
    return currentKeys[keyCode] && !evaluatedKeys.includes(keyCode);
}
//Check if a key is pressed and is unevaluated
//If a command key is pressed (ie ctrl) return false;
function keypressSingle(key){
    if(keypress(key)){
        let evt = currentKeys[charCodeOf(key)];
        return !(evt.shiftKey || evt.ctrlKey || evt.altKey);
    }else{
        return false;
    }
}

//convert a character to a code
function charCodeOf(letter){
    if(!letter)
        return -1;
    if(typeof letter === "number")
        return letter;

    return letter.toUpperCase().charCodeAt(0);
}

function isActionable(key){
    let valid = keypressSingle(key);
    if(valid)
        evaluatedKeys.push(charCodeOf(key));
    return valid;
}

setInterval(function(){
    let activeInput = isInputSelected();
    if(activeInput)
        return;

    if(keypress(191)){//?
        if(currentKeys[191].shiftKey){
            openShortcutHelp();
            evaluatedKeys.push(191);
        }
    }else if(isActionable(27)){//[esc]
        closeShortcutHelp();

    }else if(isActionable('H')){//Go Home
        menu(getSessJSON('boards'));

    }else if(isActionable('L') && getUrlID()){//View Task List
        selectBoard(getUrlID());//Load board homepage
        $('#board').val(1);//select tasks
        updateSidebarView();//open it

    }else if(isActionable('O')){//Open calendar
        loadCalendar();

    }else if(isActionable('B')){//Create new board
        createBoard();

    }else if(isActionable('C')){//Create Category
        createCategory()

    }else if(isActionable('T')){//Create Task
        createTask();

    }else if(isActionable(13)){//[enter]
        let elm = $('div[is_selected=true]');//get selected div
        if(elm.attr('id')){//check its a valid board
            elm.click();//click it
        }

    }else if(isActionable(39)){//[->]
        arrow(1);

    }else if(isActionable(37)){//[<-]
        arrow(-1);
    }
    //T -> new task
    //C -> new Category
    //B -> new board
    //O -> open calendar
}, 10);


function arrow(dir){
    arrow_last = new Date().getTime();
    setTimeout(function(){
        if(!(arrow_last + 400 <= new Date().getTime())){
            //if last was not 400 ms ago
            return;
        }
        if(evaluatedKeys.indexOf(38+dir) !== -1)
            evaluatedKeys.splice(evaluatedKeys.indexOf(38+dir), 1);
    }, 400);
    let elm;
    if(dir===1){
        elm = selectNext();
    }else{
        elm = selectPrev();
    }

    if(elm){
        elm.attr('is_selected', "true");
        elm.addClass('hover');
    }

    let currentScroll = document.getElementById('board-select').scrollTop;
    let distanceToScroll = $('div[is_selected=true]').position().top-65;
    $('#board-select').scrollTop(currentScroll+distanceToScroll);
}

function currentSelection(){
    let elm = $('div[is_selected=true]');
    $('.board').attr('is_selected',"false").removeClass('hover');
    return elm;
}

function selectPrev(){
    let elm = currentSelection();
    let previous = null;
    let done = false;
    $('#board-select').children().each(function( i ) {
        let iterElm = $(this);

        if(iterElm.attr('id') === elm.attr('id')){
            if(i !== 0) {
                elm = previous;
                done = true
            }
        }
        previous = iterElm;
    });

    if(done){//Check its a valid element
        return elm;
    } else {
        return previous;
    }
}

function selectNext(){
    let elm = currentSelection();
    let first = null;//
    let idStore = -1;//
    $('#board-select').children().each(function( i ) {
        let iterElm = $(this);
        if(i===0){
            first = iterElm;
        }
        if(iterElm.attr('id') === elm.attr('id')){
            idStore = i+1;
            if(idStore >= $('#board-select').children().length){
                idStore = 0;
            }
        }
        if(idStore === 0){
            elm = first;
        }else if(idStore === i){
            elm = iterElm;
        }
    });
    if(!first)
        return;

    if(elm.attr('id')){//Check its a valid element
        return elm;
    } else{
        return first;
    }
}