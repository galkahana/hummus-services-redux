import moment from 'moment'

const DEFAULT_DATE_TIME_FILTER  = 'MMM Do, y HH:mm:ss:SSS'

export const getDefaultDateDisplay = (date?: Date) => date ? `${moment(date).format(DEFAULT_DATE_TIME_FILTER)}ms` : 'N/A'