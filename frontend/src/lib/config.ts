
const hummusConfigValue = (key: keyof HummusConfigType) => {
    return (typeof hummusConfig !== 'undefined' &&  hummusConfig ? hummusConfig[key]: undefined)
}

const config: HummusConfigType = {
    captchaSiteKey: process.env.REACT_APP_CAPTCHA_SITE_KEY || hummusConfigValue('captchaSiteKey'),
    joinEmail: process.env.REACT_APP_JOIN_EMAIL || hummusConfigValue('joinEmail'),
    supportEmail: process.env.REACT_APP_SUPPORT_EMAIL|| hummusConfigValue('supportEmail')
}

export default config