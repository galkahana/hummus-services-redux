/**
 * You will notice that module.exports are used. this is to comply with node-config quirk that so far i hadn't had a better solution to -
 * it doesn't like the resultant build exports.default = {...} and so im not getting configs on a built command. to avoid that im using module.exports
 * which gets translateed as is.
 */
module.exports = {
    logOutput: process.env.LOG_OUTPUT || '',
    isDebug: false,
    defaultPort: process.env.PORT || 8080, 
    service: {
        name: process.env.SERVICE_NAME || 'hummus',
        url: process.env.SERVICE_URL
    },
    db: {
        connectionString: process.env.MONGODB_URI,
        connectRetryTimeGap: 5000
    },    
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY
    },
    emails: {
        adminEmail: process.env.ADMIN_EMAIL,
        joinEmail: process.env.JOIN_EMAIL,
        supportEmail: process.env.SUPPORT_EMAIL
    },
    aws: {
        // AWS AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are used directly from env vars by aws sdk
        region: process.env.AWS_REGION || 'us-west-2',
        s3: {
            uploadBucket: process.env.AWS_BUCKET || 'hummus-services'
        }
    },
    recaptcha: {
        key: process.env.RECAPTCHA_KEY,
        secret: process.env.RECAPTCHA_SECRET
    },
    jwtToken: {
        secret: process.env.JWT_KEY,
        maxAgeSeconds: 300, // 5 mts
        maxAgeSecondsRefresh: 3600 * 24 * 365 // 1 year
    },    
}