import { Auth } from './index'
import storedTokensService from '@lib/stored-tokens/service'
import hummusClientService from '@lib/hummus-client/service'


const instance = new Auth(storedTokensService, hummusClientService)
hummusClientService.setTokensProvider(instance)
export default instance