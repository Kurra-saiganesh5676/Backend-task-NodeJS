const https = require('https');
const serverOptions = require('../constants/serverOptions')

/*
* This function fetches the data from the server
* returns aggregated data based on criticality and month
*/
exports.getFixletStats = () =>{
    return new Promise((resolve,reject)=>{
        const postQuery = `{"query": "select JSON_OBJECT('SiteID', siteID, 'FixletID', id, 'Name', Title, 'Criticality', severity, 'RelevantComputerCount', count_computers(Relevant), 'SourceReleaseDate', SourceReleaseDate) from FIXLETS where siteID = 2 and Title like 'MS24-%'"}`;
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
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

                        let criticalityCount = {}
                        for(let fixlet of dataObj){
                            criticalityCount[fixlet.Criticality] ? criticalityCount[fixlet.Criticality]+=1 : criticalityCount[fixlet.Criticality]=1;
                        }
                        let finalCriticalityArr = []
                        for(const [key,values] of Object.entries(criticalityCount)){
                            finalCriticalityArr.push([key,values]);
                        }

                        let monthCount = {}
                        for(let fixlet of dataObj){
                            const sourceDate = new Date(fixlet.SourceReleaseDate);
                            let yearMonth = sourceDate.getFullYear()+" "+months[sourceDate.getMonth()];
                            monthCount[yearMonth] ? monthCount[yearMonth]+=1 : monthCount[yearMonth]=1;
                        }
                        let finalSourceDateArr = [];
                        for(const [key,values] of Object.entries(monthCount)){
                            finalSourceDateArr.push([key,values]);
                        }

                        const finalResultObject = {
                            'CriticalityAggregate' : finalCriticalityArr,
                            'MonthAggregate' : finalSourceDateArr
                        }
                        resolve(finalResultObject);
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