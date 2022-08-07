import React, { useState, useCallback, useRef } from 'react'
import ModalConfirm from './index'


type ConfirmOptions = {
    confirmTitle?: string, 
    confirmText?: string, 
    rejectText?: string
}

type ModalConfirmMethod = (confirmMessage: string, options?: ConfirmOptions) => Promise<boolean>


export const ModalConfirmContext = React.createContext<ModalConfirmMethod>(null!)


export function ModalConfirmProvider({ children }: { children: React.ReactNode }) {
    const [ confirmMessage, setConfirmMessage ] = useState<string>('')
    const [ confirmTitle, setConfirmTitle ] = useState<string>()
    const [ confirmText, setConfirmText ] = useState<string>()
    const [ rejectText, setRejectText ] = useState<string>()
    const confirmResolve = useRef<Nullable<(value: boolean)=> void>>(null)
    

    const onConfirmShow = useCallback((message: string, options: ConfirmOptions = {}) => {
        const confirmPromise = new Promise<boolean>((resolve) => {confirmResolve.current = resolve})

        setConfirmMessage(message)
        setConfirmTitle(options.confirmTitle)
        setConfirmText(options.confirmText)
        setRejectText(options.rejectText)
        return confirmPromise
    }, [])

    const onReject = useCallback(()=> {
        setConfirmMessage('')
        if(confirmResolve.current) {
            confirmResolve.current(false)
            confirmResolve.current = null
        }
    }, [])

    const onConfirm= useCallback(()=> {
        setConfirmMessage('')
        if(confirmResolve.current) {
            confirmResolve.current(true)
            confirmResolve.current = null
        }
    }, [])


    return <ModalConfirmContext.Provider value={onConfirmShow}> 
        <ModalConfirm 
            show={Boolean(confirmMessage)}  
            onReject={onReject} 
            onConfirm={onConfirm} 
            title={confirmTitle}
            body={confirmMessage}
            confirmText={confirmText} 
            rejectText={rejectText}
        />        
        {children}
    </ModalConfirmContext.Provider>
}
  

export function useModalConfirm() {
    return React.useContext(ModalConfirmContext)
}