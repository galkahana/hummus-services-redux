import React, { useState, useCallback, useRef } from 'react'
import ModalAlert from './index'


type ModalAlertMethod = (alertMessage: string, alertTitle?: string) => Promise<void>


export const ModalAlertContext = React.createContext<ModalAlertMethod>(null!)


export function ModalAlertProvider({ children }: { children: React.ReactNode }) {
    const [ alertMessage, setAlertMessage ] = useState<string>('')
    const [ alertTitle, setAlertTitle ] = useState<string>()
    const alertResolve = useRef<Nullable<()=> void>>(null)

    const onAlertShow = useCallback((alertMessage: string, alertTitle?: string) => {
        const alertPromise = new Promise<void>((resolve) => {alertResolve.current = resolve})

        setAlertMessage(alertMessage)
        setAlertTitle(alertTitle)
        return alertPromise
    }, [])

    const onDismiss = useCallback(()=> {
        setAlertMessage('')
        if(alertResolve.current) {
            alertResolve.current()
            alertResolve.current = null
        }
    }, [])

    return <ModalAlertContext.Provider value={onAlertShow}> 
        <ModalAlert show={Boolean(alertMessage)}  onDismiss={onDismiss} title={alertTitle} body={alertMessage}/>
        {children}
    </ModalAlertContext.Provider>
}
  

export function useModalAlert() {
    return React.useContext(ModalAlertContext)
}