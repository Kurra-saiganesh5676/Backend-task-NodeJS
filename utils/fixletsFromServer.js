const https = require('https');
const serverOptions = require('../constants/serverOptions')

/*
* This function fetches the data from the server
*/
exports.fixletDataFromServer= (filter) =>{

    return new Promise((resolve,reject)=>{

        const postQuery = `{"query": "select JSON_OBJECT('SiteID', siteID, 'FixletID', id, 'Name', Title, 'Criticality', severity, 'RelevantComputerCount', count_computers(Relevant), 'SourceReleaseDate', SourceReleaseDate) from FIXLETS where siteID = 2 and Title like 'MS24-%'"}`;
        const criticalityObj = {
            'Critical' : 1,
            'Important' : 2,
            'Moderate' : 3,
            'Medium' : 4,
            'Low' : 5,
            'Unspecified' : 6
        }

        try{
            let data = '';
            const options = serverOptions.getServerOptions();
            let req = https.request(options,(response)=>{
                response.on('data',(chunk)=>{
                    data += chunk;
                })
                response.on('end', () => {
                    if (response.statusCode === 200) {
                        let dataObj = JSON.parse(data);
                        if(!filter){
                            for(let i=0;i<dataObj.length;i++){
                                dataObj[i].Criticality = criticalityObj[dataObj[i].Criticality];
                            }
                            resolve(dataObj);
                        }else{
                            let filteredData = dataObj.filter((item)=>{
                                return item.Criticality.toLowerCase() === filter.toLowerCase();
                            })
                            resolve(filteredData);
                        }
                    } else {
                        console.log("Error occured with Status code", response.statusCode);
                        reject(new Error(`Status code: ${response.statusCode}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error("Error Occured ::",error);
                reject(error);
            });

            req.write(postQuery);
            req.end();
        }catch(err){
            console.log(err);
            reject(err);
        }
    })
}