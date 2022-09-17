export const siteUrlRoot = typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.host : ''
export const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || siteUrlRoot}/api`