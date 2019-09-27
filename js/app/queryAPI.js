let url = "http://192.168.0.15:8079";
let site = "http://192.168.0.23:8080/ComputingProject";

// let url = "http://localhost:8080/ComputingProject/";
// let site = "http://localhost:8080/ComputingProject";
async function get(dat) {
  let data;
  try{
    setTimeout(function(){if(!data){
      alert("Sever is taking a while to connect.  Maybe try reloading the page?");
      throw new Error("timeout");
    }}, 10000);
    data = await fetch(url + "/API/" + dat + ".json", {headers: {"jwt": "testing"}});
  }catch(error){
    alert("Unable to contact the server.  Please try again later.");
    throw error;
  }
  data = await data.json();
  if(data.error){
    window.location = site+'/login/?msg='+data.message;
  }
  return data;
}
