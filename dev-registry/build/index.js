global.__basePath = process.cwd() + '/';
const app = require(__basePath + 'app/app.js');
const port = process.env.NODE_PORT;
const host = process.env.NODE_HOST || 'localhost';

/**
 * @description Listen Server at configured port
 * @event App Listener
 */
app.listen(port,host, function () {
    console.log(`Listening port ${port}`);
});