
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};


export const AJAX = async function (url,uploadData = undefined){
  try{
  const fetchPro = uploadData ? fetch(url ,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify()
  } ) : fetch(url);
  
    const res = await Promise.race([fetch(url) , timeout(10)]);
      
    const data = await res.json();
    
    if(!res.ok) throw new Error(`${data.massage} (${res.status})`);
    return data ; 
  }catch(err){
     throw err; 
  }
}
/*
export const getJSON  = async function(url){
  try{
    const res = await Promise.race([fetch(url) , timeout(10)]);
      
    const data = await res.json();
    
    if(!res.ok) throw new Error(`${data.massage} (${res.status})`);
    return data ; 
  }catch(err){
     throw err; 
  }
}

export const sendJSON  = async function(url , uploadData ){
  try{
    const fetchPro = fetch(url ,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify()
    } );

    const res = await Promise.race([fetchPro , timeout(10)]);
      
    const data = await res.json(uploadData);
    
    if(!res.ok) throw new Error(`${data.massage} (${res.status})`);
    return data ; 
  }catch(err){
     throw err; 
  }
}*/