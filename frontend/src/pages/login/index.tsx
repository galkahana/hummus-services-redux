import React, { useState, useCallback, useRef } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import {  useNavigate, useLocation } from 'react-router-dom'
import { AxiosError } from 'axios'
import Reaptcha from 'reaptcha'
import PublicBase from 'components/public-base'
import ButtonWithSpinner from 'components/waiting/button-with-spinner'
import auth from 'lib/auth'
import { usePrincipal } from 'lib/principal'
import { createEnhancedError } from 'lib/api-helpers/EnhancedError'
import {
    LoginFormContainer,
} from './login.styles'
import { useModalAlert } from 'components/modal-alert/context'

// Something missing in history def...and we don't have to just take it.
class Location {
    state?: {
        from?: {
            pathname?: string
        }
    }

}

const Login = () => {
    const [ username, setUsername ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ captcha, setCaptcha ] = useState<string>()
    const [ waiting, setWaiting ] = useState<boolean>(false)
    const [ loginValidated, setLoginValidated ] = useState(false)
    const catpchaElement = useRef<Reaptcha>()
    const navigate = useNavigate()
    const principal = usePrincipal()
    const location = useLocation() as Location
    const showModalAlert = useModalAlert()

    const to = location.state?.from?.pathname || '/console'

    const onSetCaptchaRef = (element: Reaptcha) => {
        catpchaElement.current = element
    }


    const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>)  => {
        setUsername(event.target.value)
    }

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>)  => {
        setPassword(event.target.value)
    }

    const onCaptchaChange = useCallback((value: string) => {
        setCaptcha(value)
    }, [])    

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget
        event.preventDefault()
        let formValid = true
        if (form.checkValidity() === false) {
            event.stopPropagation()
            formValid = false
        }
        setLoginValidated(true)
        if(!formValid) {
            return
        }                

        setWaiting(true)
        auth.signin(username, password, captcha || '').then( async () => {
            await principal.identity(true) // force identity update based on login
            setWaiting(false)
            navigate(to, { replace: true })
        }).catch((ex: unknown) => {
            if(catpchaElement.current) // reset captcha for next round
                catpchaElement.current.reset()
            setWaiting(false)
            if (ex instanceof AxiosError && ex.response?.data?.info?.noCaptcha) {
                showModalAlert('Human identification data was not sent, Please confirm that you are human', 'Login Error')
            } else if (ex instanceof AxiosError && ex.response?.data?.info?.captchaError) {
                showModalAlert(ex.response.data.info.captchaError, 'Login Error')
            } else if (ex instanceof AxiosError && ex.response?.status === 401) {
                showModalAlert('Looks like there\'s a problem with the login credentials, maybe check and try again', 'Login Error')
            } else {
                showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error attempting to login but it won\'t tell us what it was.', 'Login Error')
            }
        })
    }

    return <PublicBase title="Log in to Console">         
        <Container>
            <LoginFormContainer>
                <Form  onSubmit={onSubmit} noValidate validated={loginValidated}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control required type="text" autoCorrect='off' name='username' defaultValue={username} onChange={onChangeUsername}/>
                        <Form.Control.Feedback type="invalid">
                                We're gonna need a username here
                        </Form.Control.Feedback>   
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" name='password' defaultValue={password} onChange={onChangePassword}/>
                        <Form.Control.Feedback type="invalid">
                                A password would be nice
                        </Form.Control.Feedback>   
                    </Form.Group>
                    <Form.Group>
                        <Reaptcha ref={onSetCaptchaRef} sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY as string} onVerify={onCaptchaChange}/>
                        <Form.Control required value={captcha} type="text" className="d-none"/>
                        <Form.Control.Feedback type="invalid">
                                Please mark that you are <strong>not</strong> a robot
                        </Form.Control.Feedback>                           
                    </Form.Group>                    
                    <ButtonWithSpinner variant="primary" type="submit" className='mt-3' waiting={waiting}>
                        Log In
                    </ButtonWithSpinner>                        
                </Form>
            </LoginFormContainer>
        </Container>
    </PublicBase>

}

export default Login
