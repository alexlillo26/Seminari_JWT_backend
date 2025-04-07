export function loggingHandler(req, res, next) {
    console.log(`Incoming -Method: [${req.method}] -URL [${req.url}] - IP [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        console.log(`Incoming -Method: [${req.method}] -URL [${req.url}] - IP [${req.socket.remoteAddress}] -STATUS [${req.statusCode}]`);
    });
    next();
}
