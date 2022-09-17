
import React, { useState, useCallback, useEffect } from 'react'
import hummusClientService from '@lib/hummus-client/service'
import { ConfigResponse } from '@lib/hummus-client/types'


export const ConfigContext = React.createContext<Nullable<ConfigResponse>>(null!)


export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<Nullable<ConfigResponse>>(null)

    useEffect(() => {
        hummusClientService.getConfig().then((value) => setConfig(value)).catch((ex) => console.log(ex))
    }, [])

    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}


export function useConfig() {
    return React.useContext(ConfigContext)
}