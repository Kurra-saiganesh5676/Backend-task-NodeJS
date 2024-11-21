const http = require('http');
const url = require('url');
const getReqCtrl = require('./controllers/getReqCtrl');

/*
* Creating a server
*/
const app = http.createServer(async (req,res)=>{

    let parsedUrl = url.parse(req.url, true);

    if(req.method==='GET'){
        await getReqCtrl.handleGetRequests(req,res,parsedUrl);  //calling handler which handles GET Requests
    }
    res.end();
})

const PORT=8181;

app.listen(PORT,()=>{
    console.log('Server is running on Port: '+PORT);
})

