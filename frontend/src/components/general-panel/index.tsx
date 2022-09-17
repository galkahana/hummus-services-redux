import React, { useCallback, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { AxiosError } from 'axios'

import ButtonWithSpinner from '@components/waiting/button-with-spinner'
import { useModalAlert } from '@components/modal-alert/context'
import { useToast } from '@components/toast'
import { usePrincipal } from '@lib/principal'
import hummusClientService from '@lib/hummus-client/service'
import { createEnhancedError } from '@lib/api-helpers/EnhancedError'

import { GeneralPanelContainer } from './general-panel.styles'

const GeneralPanel = () => {
    const [ meName, setMeName ] = useState<string>('')
    const [ meEmail, setMeEmail ] = useState<string>('')
    const [ updatingProfile, setUpdatingProfile ] = useState<boolean>(false)
    const [ profileValidated, setProfileValidated ] = useState(false)
    const [ meUsername, setMeUsername ] = useState<string>('')
    const [ updatingUsername, setUpdatingUsername ] = useState<boolean>(false)
    const [ usernameValidated, setUsernameValidated ] = useState(false)
    const [ oldPassword, setOldPassword ] = useState<string>('')
    const [ newPassword, setNewPassword ] = useState<string>('')
    const [ newPasswordRepeat, setNewPasswordRepeat ] = useState<string>('')
    const [ updatingPassword, setUpdatingPassword ] = useState<boolean>(false)
    const [ passwordFormSubmitted, setPasswordFormSubmitted ] = useState(false)

    const principal = usePrincipal()
    const showModalAlert = useModalAlert()
    const showToast = useToast()

    useEffect(() => {
        principal.identity().then((user) => {
            if (!user)
                return
            setMeName(user.name || '')
            setMeEmail(user.email || '')
            setMeUsername(user.username)
        })
    }, [ principal ])

    const onMeNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMeName(event.target.value)
    }, [])

    const onMeEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMeEmail(event.target.value)
    }, [])

    const onProfileFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget
        event.preventDefault()
        let formValid = true
        if (form.checkValidity() === false) {
            event.stopPropagation()
            formValid = false
        }
        setProfileValidated(true)
        if (!formValid) {
            return
        }

        setUpdatingProfile(true)
        hummusClientService.patchMe({
            name: meName,
            email: meEmail
        }).then(async (newUser) => {
            principal.setIdentity(newUser)
            setUpdatingProfile(false)
            showToast('Profile updated successfully', 'Profile Update')
        }).catch((ex: unknown) => {
            setUpdatingProfile(false)
            if (ex instanceof Error) {
                showModalAlert(ex.message, 'Profile Update')
            }
        })

    }, [ meEmail, meName, principal, showModalAlert, showToast ])


    const onMeUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMeUsername(event.target.value)
    }, [])

    const onUsernameFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget
        event.preventDefault()
        let formValid = true
        if (form.checkValidity() === false) {
            event.stopPropagation()
            formValid = false
        }
        setUsernameValidated(true)
        if (!formValid) {
            return
        }

        setUpdatingUsername(true)
        hummusClientService.changeUsername(meUsername).then(async () => {
            principal.identity(true)
            setUpdatingUsername(false)
            showToast('Username updated successfully', 'Profile Update')
        }).catch((ex: unknown) => {
            setUpdatingUsername(false)
            if (ex instanceof AxiosError && ex.response?.data?.info?.duplicateUsername) {
                showModalAlert('A user with this username exists already, please select a different username', 'Username Update')
            } else {
                showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error updating the username but it won\'t tell us what it was.', 'Username Update')
            }
        })

    }, [ meUsername, principal, showModalAlert, showToast ])

    const onOldPasswordchanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setOldPassword(event.target.value)
    }, [])

    const onNewPasswordChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value)
    }, [])

    const onNewPasswordRepeat = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordRepeat(event.target.value)
    }, [])

    const onPasswordFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        let formValid = true
        formValid = !!oldPassword && !!newPassword && !!newPasswordRepeat && (newPassword === newPasswordRepeat)
        setPasswordFormSubmitted(true)
        if (!formValid) {
            return
        }

        setUpdatingPassword(true)
        hummusClientService.changePassword(oldPassword, newPassword).then(async () => {
            setUpdatingPassword(false)
            showToast('Password changed successfuly', 'Password change')
        }).catch((ex: unknown) => {
            setUpdatingPassword(false)
            if (ex instanceof AxiosError && ex.response?.data?.info?.oldPasswordMismatch) {
                showModalAlert('Password does not match old user password', 'Password Update')
            } else {
                showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error updating the password but it won\'t tell us what it was.', 'Password Update')
            }
        })

    }, [ oldPassword, newPassword, newPasswordRepeat, showModalAlert, showToast ])

    return <GeneralPanelContainer>
        <div className="section profile">
            <div className="section-title">
                <h3>Profile</h3>
            </div>
            <div className="section-content">
                <Form onSubmit={onProfileFormSubmit} noValidate validated={profileValidated}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" autoCorrect="off" autoCapitalize='off' value={meName} onChange={onMeNameChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email </Form.Label>
                        <Form.Control required type="email" value={meEmail} onChange={onMeEmailChange} />
                        <Form.Text muted>
                            <small>Match your email with your <a href="http://www.gravatar.com" target="_blank" rel="noreferrer">Gravatar</a> account for a nice avatar</small>
                        </Form.Text>
                    </Form.Group>
                    <ButtonWithSpinner variant="primary" type="submit" className='mt-3' waiting={updatingProfile}>
                        Update
                    </ButtonWithSpinner>
                </Form>
            </div>
            <div className="section account">
                <div className="section-title">
                    <h3>Account</h3>
                </div>
                <div className="section-content username">
                    <Form onSubmit={onUsernameFormSubmit} noValidate validated={usernameValidated}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control required type="text" autoCorrect="off" autoCapitalize='off' value={meUsername} onChange={onMeUsernameChange} />
                        </Form.Group>
                        <ButtonWithSpinner variant="primary" type="submit" className='mt-3' waiting={updatingUsername}>
                            Change Username
                        </ButtonWithSpinner>
                    </Form>
                </div>
                <div className="section-content password">
                    <Form onSubmit={onPasswordFormSubmit} noValidate>
                        <Form.Group>
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control isInvalid={(!oldPassword) && passwordFormSubmitted} type="password" value={oldPassword} onChange={onOldPasswordchanged} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control isInvalid={!newPassword && passwordFormSubmitted} type="password" value={newPassword} onChange={onNewPasswordChanged} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Repeat new Password</Form.Label>
                            <Form.Control isInvalid={(!newPasswordRepeat || newPassword !== newPasswordRepeat) && passwordFormSubmitted} type="password" value={newPasswordRepeat} onChange={onNewPasswordRepeat} />
                            <Form.Control.Feedback type="invalid">
                                New Password and New Password Repeat do not match
                            </Form.Control.Feedback>
                        </Form.Group>
                        <ButtonWithSpinner variant="primary" type="submit" className='mt-3' waiting={updatingPassword}>
                            Change Password
                        </ButtonWithSpinner>
                    </Form>
                </div>
            </div>
        </div>
    </GeneralPanelContainer>
}

export default GeneralPanel