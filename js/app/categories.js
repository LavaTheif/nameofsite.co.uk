function createCategory(){
    let board_id = getUrlID();
    if(!board_id)
        return;

    get('createCategory',{board_id: board_id}).then((data) => {
        if(data.success) {
            sideBarTasks();
            openCategory(data.task_id);
        }else{
            alert(data.msg);
        }
    })
}

async function openCategory(id){
    let boardID = getUrlID();
    let subTaskJsonList = await renderTasks(id);
    // saveSess("subTaskDat", subTaskJsonList);
    window.history.pushState(subTaskJsonList[id].name, subTaskJsonList[id].name, "?view="+boardID+"&task="+id);
    $('#task-name').val(subTaskJsonList[id].title).prop('disabled', false);
    $('#task-desc').val(subTaskJsonList[id].details).prop('disabled', false);
    let dateObj = new Date(Number(subTaskJsonList[id].due_date));
    let date = dateObj.getFullYear()+"-";
    let m = dateObj.getMonth()+1;
    date+=(m < 10? "0"+m:m)+"-";
    let d = dateObj.getDate();
    date+=(d < 10? "0"+d:d);
    $('#task-due').val(date).prop('disabled', false);
}


//Save category details when input loses focus
function saveCategoryDetails(){
    get('updateCategory', {board_id: getUrlID(), task_id:getUrlTask(), task_name: $('#task-name').val(), task_desc: $('#task-desc').val()}).then((data) => {
        $('#task-name').val(data.title);
        $('#task-desc').val(data.details);
        let children = $('#'+getUrlTask()).children();
        children.eq(0).html("<u><b>"+fullySanitize(data.title)+"</b></u>");
        children.eq(1).html(fullySanitize(data.details));
    });
}

function deleteCategory(id, category){
    get('deleteCategory',{board_id: getUrlID(), task_id: id, root_id: getUrlTask(), is_top: category}).then((data) => {
        if(category){
            $('#'+id).remove();
            if(id === getUrlTask()){
                $('#subtask-container').html("Category Deleted.");
            }
            let storedData = getSessJSON('taskDat');
            let categoryData = storedData.tasks;
            for(let i = 0; i < categoryData.length; i++){
                if(!categoryData[i])
                    continue;
                if(categoryData[i].task_id === id){
                    delete categoryData[i];
                    storedData.tasks = categoryData;
                    break;
                }
            }
            saveSess('taskDat', storedData);
        }else{
            $('#task-box-'+id).remove();
            let storedData = getSessJSON('subTaskDat');
            delete storedData[id];
            saveSess('subTaskDat', storedData);
        }
    });
}