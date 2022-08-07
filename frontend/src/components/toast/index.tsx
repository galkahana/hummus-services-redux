import React, { useState, useCallback } from 'react'
import Toast, { ToastProps } from 'react-bootstrap/Toast'

import { TopToast } from './toast.styles'

type ToastMethod = (toastMessage: string, toastTitle?: string, toastOptions?: ToastProps) => void

export const ToastContext = React.createContext<ToastMethod>(null!)

const defaultToastProps = {
    delay: 2000,
    autohide: true
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [ toastMessage, setToastMessage ] = useState<string>('')
    const [ toastTitle, setToastTitle ] = useState<Nullable<string>>(null)
    const [ toastOptions, setToastOptions ] = useState<Nullable<ToastProps>>(null)

    const onToastLaunch = useCallback((toastMessage: string, toastTitle: Nullable<string> = null, toastOptions: Nullable<ToastProps> = null) => {
        setToastMessage(toastMessage)
        setToastTitle(toastTitle)
        setToastOptions(toastOptions)
    }, [])

    return <ToastContext.Provider value={onToastLaunch}>
        <TopToast onClose={() => setToastMessage('')} show={Boolean(toastMessage)} {...{ ...defaultToastProps, ...toastOptions }} >
            {toastTitle &&
            <Toast.Header>
                <strong className="me-auto">{toastTitle}</strong>
            </Toast.Header>
            }
            <Toast.Body>{toastMessage}</Toast.Body>
        </TopToast>    
        {children}
    </ToastContext.Provider>
}
  

export function useToast() {
    return React.useContext(ToastContext)
}