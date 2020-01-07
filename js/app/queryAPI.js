// let url = "http://192.168.0.15:8079";
//let site = "http://192.168.0.23:8080/nameofsite.co.uk";

//let url = "http://192.168.0.60:8079";
// let site = "http://:8080/nameofsite.co.uk";

let site = "http://nameofsite.co.uk/"
let url = "172.31.26.183:8079";

async function get(dat, send, bypassSuccessCheck) {
  let data;
  try{
    setTimeout(function(){if(!data){
      alert("Sever is taking a while to connect.  Maybe try reloading the page?");
      throw new Error("timeout");
    }}, 10000);
      data = await fetch(url + "/API/" + dat + ".json", {method:'POST', headers: {"jwt": getSess('jwt'), 'refresh': getSess('refresh')}, body:JSON.stringify(send)});
  }catch(error){
    alert("Unable to contact the server.  Please try again later.");
    throw error;
  }
  data = await data.json();
  if(data.error){
    window.location = site+'/login/?msg='+data.message;
  }

  if(data['jwt']){
    saveSess('jwt', data['jwt']);
    let dat = JSON.parse(atob(data['jwt'].split(".")[1]));
    let cachedUUIDs = getSessJSON('uuid-to-name') || {};
    cachedUUIDs[dat.uid] = dat.sub;
    saveSess('uuid-to-name', cachedUUIDs);
    saveSess('uid', dat.uid);

  }
  if(data['refresh']){
    saveSess('refresh', data['refresh']);
  }

  if(bypassSuccessCheck)
    return data;

  if(data.success === false){
    if(data.close)
      menu(getSessJSON('boards'));
    alert(data.msg);
    throw new Error("invalid request");
  }
  return data;
}
