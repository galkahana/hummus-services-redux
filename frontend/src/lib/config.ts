
const hummusConfigValue = <K extends keyof HummusConfigType>(key:K) => {
    return (typeof hummusConfig !== 'undefined' &&  hummusConfig ? hummusConfig[key]: undefined)
}

const config: HummusConfigType = {
    captchaSiteKey: process.env.REACT_APP_CAPTCHA_SITE_KEY || hummusConfigValue('captchaSiteKey'),
    joinEmail: process.env.REACT_APP_JOIN_EMAIL || hummusConfigValue('joinEmail'),
    supportEmail: process.env.REACT_APP_SUPPORT_EMAIL || hummusConfigValue('supportEmail'),
    // the below are for running frontend without backend and aimed to provide directions about the project
    noBackend: Boolean(process.env.REACT_APP_NO_BACKEND),
    githubProjectUrl: process.env.REACT_APP_NO_BACKEND_PROJECT_URL
}

export default config