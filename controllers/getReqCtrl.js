const sendResCtrl = require('./sendResCtrl')
const fixletsUtil = require('../utils/fixlets');
const fixletServerUtil = require('../utils/fixletsFromServer');
const fixletStatUtil = require('../utils/fixletstats')

const contentTypeHtml = {'Content-Type' : 'text/html'};
const contentTypeJson = { 'Content-Type': 'application/json' };

const homeHtml = `<p>This is Home</p><p>route to '/fixlets' to see all the details from fixlets.csv file</p><p>route to '/fixletsfromserver' to see details of fixlets from the server</p><p>route to '/fixletsfromserver?criticality=Value' to see details of fixlet from the server with criticality filter</p><p>route to '/fixletstats' to see the fixlets result aggregated based on criticality and month</p>`;

/*
* This finction handles all the GET requests
* makes a call to the respective function based on the path
* finally sends the response to the client
*/
exports.handleGetRequests = async (req,res,parsedUrl)=>{

    if(parsedUrl.path==='/'){
        console.info('[/Home]')
        sendResCtrl.sendResponse(res,200,contentTypeHtml,homeHtml);
    }

    else if(parsedUrl.path==='/fixlets'){
        console.log('[/fixlets call from file]');
        let data = fixletsUtil.getFixletData();  //calling function to get data from fixlets.csv file
        sendResCtrl.sendResponse(res,200,contentTypeJson,data);
    }

    else if(parsedUrl.path.startsWith('/fixletsfromserver')){
        try{
            if(parsedUrl.query.criticality){
                console.log('[/fixletsFromServer with filter]')
                let data = await fixletServerUtil.fixletDataFromServer(parsedUrl.query.criticality)  //calling function to get data from server with filter
                sendResCtrl.sendResponse(res,200,contentTypeJson,data);
            }
            else{
                console.log('[/fixletsFromServer without filter]')
                let data = await fixletServerUtil.fixletDataFromServer();   //calling function to get data from server without filter
                sendResCtrl.sendResponse(res,200,contentTypeJson,data);
            }
        }
        catch(err){
            console.log('Error:',err);
            sendResCtrl.sendResponse(res,500,contentTypeJson,err);
        }
    }
    else if(parsedUrl.path==='/fixletstats'){
        console.log('[/fixletstats Call]')

        try{
            let data = await fixletStatUtil.getFixletStats();   //calling function to get fixlet aggregated data
            sendResCtrl.sendResponse(res,200,contentTypeJson,data);
        }
        catch(err){
            sendResCtrl.sendResponse(res,500,contentTypeJson,err);
        }
    }
    else {
        sendResCtrl.sendResponse(res, 404, 'text/plain', 'Not Found');
    }
}