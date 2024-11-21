/*
* This file contains the code for sending response to the client.
*/
exports.sendResponse = (res, statusCode, contentType, data) => {
    res.writeHead(statusCode,contentType);
    res.end(JSON.stringify(data,null,4));
}