function submitComment(content, task_id){
    let board_id = getUrlID();
    if(!board_id)
        return;

    let root_id = getUrlTask();
    if(!root_id)
        return;

    $('#type-msg').val("");
    let now = new Date().getTime();
    let uid = getSess('uid');
    addComment(uid,getSessJSON('uuid-to-name')[uid] ,fullySanitize(content), now, new Date().getTime()+"-sending");

    get('submitComment',{board_id: board_id, content: content, task_id: task_id, root_id: root_id}).then((data) => {
        if(data.success) {
            $('#'+now+"-sending").attr('id', data.comment_id);
        }else{
            alert(data.msg);
            //TODO: Remove sending comment thingy or add resend option
        }
    })
}

function addComment(uuid, name, content, time, msg_id){
    let msgArea = $('#subtask-messages');
    msgArea.append(
        `<div class="comment" id="comment-${msg_id}">
                <div class="comment-name" uuid="${uuid}">${fullySanitize(name)}</div><div class="comment-time">${new Date(Number(time)).toUTCString()}</div>
                <div class="msg-content">${content}</div>
             </div>`
    );
    msgArea.scrollTop(msgArea.prop('scrollHeight'));
}

function pullComments(task_id){
    let board_id = getUrlID();
    if(!board_id)
        return;
    let msgArea = $('#subtask-messages');
    msgArea.html("");

    get('pullComments',{board_id: board_id, task_id: task_id}).then((data) => {
        if(data.success) {
            let comments = data.comments;
            let uuids_to_get = [];
            let cachedUUIDs = getSessJSON('uuid-to-name') || {};
            for(let i = 0; i < comments.length; i++){
                let com = comments[i];
                let content = fullySanitize(com.content).replace("\n","<br>");
                let uuid = com.user_id;
                let name = cachedUUIDs[uuid];
                if(!name){
                    name = uuid;
                    if(!uuids_to_get.includes(uuid)){
                        uuids_to_get.push(uuid);
                    }
                }
                let time = com.timestamp;
                let msg_id = com.comment_id;
                addComment(uuid, name, content, time, msg_id);
            }
            cacheUUIDs(uuids_to_get);

        }else{
            alert(data.msg);
        }
    })
}

function cacheUUIDs(uuids){
    if(!uuids)
        return;
    if(uuids.length === 0)
        return;

    get('bulkUserData', {uuids: uuids}).then((data) => {
        if(data.success){
            let users = data.data;
            let cachedUUIDs = getSessJSON('uuid-to-name') || {};
            for(let i = 0; i < users.length; i++){
                let user = users[i];
                cachedUUIDs[user.id] = user.username;
                $('div[uuid='+user.id+']').html(fullySanitize(user.username));
            }
            saveSess('uuid-to-name', cachedUUIDs);
        }
    })
}

function deleteComment(id, category) {
    //TODO
}