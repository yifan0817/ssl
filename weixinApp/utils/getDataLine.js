var getDataLine = function(resource,key,value){
    var res = [];
    for(var i=0;i<resource.length;i++){
        if(resource[i][key]==value){
            res.push(resource[i]);
        }
    }
    if(res.length===1){
        return res[0];
    }
    return res;
}

module.exports = {
  getDataLine: getDataLine
}