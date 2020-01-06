function taskContextMenu(evt){
    defaults(evt);
    let elm = $(evt.delegateTarget);
    let id = elm.attr('id').replace('task-','');
    createContextMenuShell(id);
    appendContextElm(id, "<u><b>Task</b></u>");
    appendContextElm(id, "");
    appendContextElm(id, "Open", function(){elm.click()});
    appendContextElm(id, "New Subtask", function(){createTask(id)});
    appendContextElm(id, "Update Status", function(e){
        defaults(e);
        let _id = id+"-status";
        createContextMenuShell(_id);
        appendContextElm(_id, "< back", function(){setTimeout(()=>{categoryContextMenu(evt)}, 10)});
        appendContextElm(_id, "Complete", function(){saveSubtaskStatus(id, 2)});
        appendContextElm(_id, "WIP", function(){saveSubtaskStatus(id, 1)});
        appendContextElm(_id, "To Do", function(){saveSubtaskStatus(id, 0)});
    });
    appendContextElm(id, "Delete", function(){deleteCategory(id, false)});
}

function categoryContextMenu(evt){
    defaults(evt);
    let elm = $(evt.delegateTarget);
    let id = elm.attr('id');
    createContextMenuShell(id);
    appendContextElm(id, "<u><b>Category</b></u>");
    appendContextElm(id, "");
    appendContextElm(id, "Open", function(){openCategory(id)});
    appendContextElm(id, "Update Status", function(e){
        defaults(e);
        let _id = id+"-status";
        createContextMenuShell(_id);
        appendContextElm(_id, "< back", function(){setTimeout(()=>{categoryContextMenu(evt)}, 10)});
        appendContextElm(_id, "Complete", function(){saveSubtaskStatus(id, 2)});
        appendContextElm(_id, "WIP", function(){saveSubtaskStatus(id, 1)});
        appendContextElm(_id, "To Do", function(){saveSubtaskStatus(id, 0)});
    });
    appendContextElm(id, "Delete", function(){deleteCategory(id, true)});
}

function defaults(evt){
    evt.preventDefault();
    evt.stopPropagation();
}

function closeContext(){
    let menu = $('.context-menu');
    menu.remove();
}

function createContextMenuShell(id){
    closeContext();
    $('body').append(`<div class="context-menu" id="${getContextID(id)}"></div>`)
    let context = $('#'+getContextID(id));
    context.css('left',mouseX);
    context.css('top',mouseY);
    // context.append
}

function getContextID(id){
    return "context-menu-"+id;
}

function appendContextElm(_id, text, callback) {
    let id = Math.floor(10000*Math.random())+"-context";
    $('.context-menu').append('<div class="context-menu-elm" id="'+id+'"></div>');
    let elm = $('#'+id);
    elm.html(text);
    if(!callback)
        callback = defaults;
    elm.click(callback);
}