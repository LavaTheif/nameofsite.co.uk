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

function getUrlParams(){
    return  window.location.href.replace(/.*\?/,"").split('&');
}

function getUrlMsg(){
    let urlParams = getUrlParams();
    let viewing="";
    //check each of the paramaters
    for(let i = 0; i < urlParams.length; i++){
        let p = urlParams[i];
        //if it matches "view=" followed by an 8 digit ID, set the viewing variable to that id.
        if(p.match(/^msg=.*$/)){
            viewing = p.replace(/msg=/,"");
            break;
        }
    }
    return decodeURI(viewing);
}

function getUrlTask(){
    let urlParams = getUrlParams();
    let viewing;
    //check each of the paramaters
    for(let i = 0; i < urlParams.length; i++){
        let p = urlParams[i];
        //if it matches "view=" followed by an 8 digit ID, set the viewing variable to that id.
        if(p.match(/^task=[0-9]*$/)){
            viewing = p.replace(/task=/,"");
            break;
        }
    }
    return viewing;
}

function getUrlID(){
    let urlParams = getUrlParams();
    let viewing;
    //check each of the paramaters
    for(let i = 0; i < urlParams.length; i++){
        let p = urlParams[i];
        //if it matches "view=" followed by an 8 digit ID, set the viewing variable to that id.
        if(p.match(/^view=[a-zA-Z0-9]{8}$/)){
            viewing = p.replace(/view=/,"");
            break;
        }
    }
    return viewing;
}


function alert(message){
    showOverlay($("#message-box"));
    $('#message-box-text').html(message);
}

function showOverlay(item){
    $('#darken').removeClass("hidden").addClass("show");
    item.removeClass("hidden").addClass("show");
}

function hideOverlay(btn, bool){
    $('#darken').removeClass("show").addClass("hidden");
    if(!bool)
        btn = $(btn).parent();
    else
        btn = $(btn);
    btn.removeClass("show").addClass("hidden");
}

function isInputSelected(){
    return null != $(':focus').attr('id');
}

function fullySanitize(str){
    return String(str)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;")
        .replace(/\//g,"&#x2F;")
}

//TODO: Allow things like bold and italics etc
// function partialSanitize(str){
//     let full = fullySanitize(str);
// }

