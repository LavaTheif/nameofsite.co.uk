let currentKeys = {};
let evaluatedKeys = [];
let mouseX = 0, mouseY = 0;

async function loadData(){
  showOverlay($("#message-box-loading"));

  //get the url, remove everything up to and including the ? and then split it at every &
  let viewing = getUrlID();

  // let userDat = await get('userData');
  // console.log(data);
  let boardDat = await get('userBoards');
  saveSess('boards', boardDat);
  // saveSess('userDat', userDat);

  hideOverlay($("#message-box-loading"), true);
  if(!viewing)//if not viewing a board, open the page to let them choose a board
    menu(boardDat);
  else{
    selectBoard(viewing);
  }

}


//An object that is used to check if the console is opened.
let openConsole = function(){};
openConsole.toString = function(){
  this.opened = true;
};

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
