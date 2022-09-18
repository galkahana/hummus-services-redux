import { HummusClient } from './index'


const noBackend = Boolean(process.env.NEXT_PUBLIC_NO_BACKEND)
const githubProjectUrl = process.env.NEXT_PUBLIC_NO_BACKEND_PROJECT_URL

export default new HummusClient(process.env.NEXT_PUBLIC_API_URL || '',
    noBackend ? {
        noBackend: true,
        noBackendMessage: `Demo project backend is no longer available. You can still read about the project and try it out yourself though. Follow the instructions in the projects [repo](${githubProjectUrl}).`
    } : {}
)