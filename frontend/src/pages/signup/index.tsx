import React, { useState, useCallback, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { AxiosError } from 'axios'
import Reaptcha from 'reaptcha'
import {  useNavigate } from 'react-router-dom'

import ButtonWithSpinner from 'components/waiting/button-with-spinner'
import { useModalAlert } from 'components/modal-alert/context'
import { useToast } from 'components/toast'
import authService from 'lib/auth/service'
import { usePrincipal } from 'lib/principal'
import PublicBase from 'components/public-base'
import { createEnhancedError } from 'lib/api-helpers/EnhancedError'
import { SignupPage } from './signup.styles'
import config from 'lib/config'

const Signup = () => {
    const [ username, setUsername ] = useState<string>('')
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ passwordRepeat, setPasswordRepeat ] = useState<string>('')
    const [ captcha, setCaptcha ] = useState<string>()
    const [ formSubmitted, setFormSubmitted ] = useState(false)
    const [ waitingOnSignup, setWaitingOnSignup ] = useState(false)
    const catpchaElement = useRef<Reaptcha>()

    const showModalAlert = useModalAlert()
    const showToast = useToast()
    const principal = usePrincipal()
    const navigate = useNavigate()

    const captchaAvailable = Boolean(config.captchaSiteKey)

    const onSetCaptchaRef = (element: Reaptcha) => {
        catpchaElement.current = element
    }    
    
    const onUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>)=> {
        setUsername(event.target.value)
    }, [])    
    const onEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>)=> {
        setEmail(event.target.value)
    }, [])    
    const onPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>)=> {
        setPassword(event.target.value)
    }, [])    
    const onPasswordRepeatChange = useCallback((event: React.ChangeEvent<HTMLInputElement>)=> {
        setPasswordRepeat(event.target.value)
    }, [])    

    const onCaptchaChange = useCallback((value: string) => {
        setCaptcha(value)
    }, [])


    const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // Did you know? !!XXX isType for non Falsy, while Boolean(XXX) does not. and i got convinced to use Boolean. unbelievable. 
        const formValid = (!!captcha || !captchaAvailable) && Boolean(username) && Boolean(email) && Boolean(password) && Boolean(passwordRepeat) && (password === passwordRepeat)
        setFormSubmitted(true)
        if(!formValid) {
            return
        }

        setWaitingOnSignup(true)
        authService.signup(username, email, password, captcha).then( async () => {
            showToast('User created successfully :)')
            await principal.identity(true) // force identity update based on login
            setWaitingOnSignup(false)
            navigate('console')
        }).catch((ex: unknown) => {
            if(catpchaElement.current) // reset captcha for next round
                catpchaElement.current.reset()
            setWaitingOnSignup(false)
            if(ex instanceof AxiosError && ex.response?.data?.info?.duplicateUsername) {
                showModalAlert('A user with this username exists already, please select a different username', 'User Signup')
            } else if (ex instanceof AxiosError && ex.response?.data?.info?.noCaptcha) {
                showModalAlert('Human identification data was not sent, Please confirm that you are human', 'User Signup')
            } else if (ex instanceof AxiosError && ex.response?.data?.info?.captchaError) {
                showModalAlert(ex.response.data.info.captchaError, 'User Signup')
            } else {
                showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error creating the user but it won\'t tell us what it was.', 'User Signup')
            }
        })
    }, [ username, email, password, passwordRepeat, captcha, captchaAvailable, showToast, showModalAlert, principal, navigate ])


    return <PublicBase title="Sign Up">
        <SignupPage>
            <Container>
                <div className="signup-form">
                    <h3 className="form-title">Create a new account</h3>
                    <Form onSubmit={onFormSubmit} noValidate>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control isInvalid={(!username) && formSubmitted} type="text" autoCorrect="off" value={username} onChange={onUsernameChange} required/>
                            <Form.Control.Feedback type="invalid">
                                Please choose a username
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control isInvalid={(!email) && formSubmitted} type="email" autoCorrect="off" value={email} onChange={onEmailChange} required/>
                            <Form.Control.Feedback type="invalid">
                                Please enter your email
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control isInvalid={(!password) && formSubmitted} type="password" autoCorrect="off" value={password} onChange={onPasswordChange} required/>
                            <Form.Control.Feedback type="invalid">
                                Please enter password
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control isInvalid={(!passwordRepeat || passwordRepeat !== password) && formSubmitted} type="password" autoCorrect="off" value={passwordRepeat} onChange={onPasswordRepeatChange} required/>
                            <Form.Control.Feedback type="invalid">
                                    Password and Repeat password fields mismatch. Please repeat the password.
                            </Form.Control.Feedback>
                        </Form.Group>
                        {captchaAvailable &&
                            <Form.Group>
                                <Reaptcha ref={onSetCaptchaRef} sitekey={config.captchaSiteKey} onVerify={onCaptchaChange}/>
                                <Form.Control required isInvalid={(!captcha) && formSubmitted} value={captcha || ''} type="hidden"/>
                                <Form.Control.Feedback type="invalid">
                                        Please mark that you are <strong>not</strong> a robot
                                </Form.Control.Feedback>                            
                            </Form.Group>
                        }
                        <ButtonWithSpinner variant="primary" type="submit" className='mt-3' waiting={waitingOnSignup}>
                            Create Account
                        </ButtonWithSpinner>                         
                    </Form>
                </div>
            </Container>
        </SignupPage>
    </PublicBase>
}


export default Signup