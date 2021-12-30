import express from 'express';
import path from 'path';
import { apiRouter } from './routes/api.route';
const app = express();
require('dotenv').config();

app.use(function(req: any, res: any, next){
    const corsWhitelistServers = [
        'http://localhost:3000'
    ];

    if (corsWhitelistServers.indexOf(req.headers.origin) !== -1) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
    }
    
    next();
});

app.locals.env = process.env;
app.use('/v1/api', apiRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req: any, res: any) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);