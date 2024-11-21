const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname,'../','files','fixlets.csv');

/*
* This function reads the data from fixlets.csv file
*/
exports.getFixletData = ()=>{
    
    let dataBuffer = fs.readFileSync(csvFilePath);
    let dataString = dataBuffer.toString()
    let lines = dataString.split('\n');

    let headings = lines[0].split(',');

    let finalObj = [];
    let len= lines.length;
    for(let i=1 ; i<len; i++){
        let contentArr = lines[i].split(',');
        let obj ={
            Criticality : contentArr[3],
            FxiletID : contentArr[1],
            Name : contentArr[2],
            RelevantComputerCount : contentArr[4],
            SiteID : contentArr[0]
        }
        finalObj.push(obj);
    }

    return finalObj;

}