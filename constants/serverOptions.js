/*
* This returns the server options of the BigFix server.
*/
exports.getServerOptions = () =>{
    const USERNAME = 'admin';
    const PASSWORD = 'NcweJrthQZdx58r';
    const HOSTNAME = 'bigfix-server.sbx0228.play.hclsofy.dev';

    const options = {
        hostname : HOSTNAME,
        path : '/api/query',
        method : 'POST',
        headers : {
            'Authorization': 'Basic ' + Buffer.from(USERNAME + ':' + PASSWORD).toString('base64'),
            'Content-Type' : 'application/json+sql',
        },
        rejectUnauthorized: false,
    }
    return options;
}