/**
 * You will notice that module.exports are used. this is to comply with node-config quirk that so far i hadn't had a better solution to -
 * it doesn't like the resultant build exports.default = {...} and so im not getting configs on a built command. to avoid that im using module.exports
 * which gets translateed as is.
 */
module.exports = {
    logOutput: process.env.LOG_OUTPUT || '',
    isDebug: false,
    defaultPort: process.env.PORT || 8080, 
    db: {
        connectionString: process.env.MONGODB_URI,
        connectRetryTimeGap: 5000
    },    
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY
    },
    aws: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        region: process.env.AWS_REGION || 'us-west-2'
    },
    recaptcha: {
        key: process.env.RECAPTCHA_KEY,
        secret: process.env.RECAPTCHA_SECRET
    }
}