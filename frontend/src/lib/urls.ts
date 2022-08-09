export const siteUrlRoot = window.location.protocol + '//' + window.location.host
export const apiUrl = `${process.env.REACT_APP_API_URL || siteUrlRoot}/api`