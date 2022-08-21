import { HummusClient } from './index'
import config from 'lib/config'

export default new HummusClient(process.env.REACT_APP_API_URL || '', 
    config.noBackend ? { 
        noBackend: true, 
        noBackendMessage: `Demo project backend is no longer available. You can still read about the project and try it out yourself though. Follow the instructions in the projects [repo](${config.githubProjectUrl}).` 
    }: {}
)