export default {
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