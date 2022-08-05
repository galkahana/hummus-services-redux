import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {  useNavigate, useLocation } from 'react-router-dom'

import PublicBase from 'components/public-base'
import ButtonWithSpinner from 'components/waiting/button-with-spinner'
import auth from 'lib/auth'
import { usePrincipal } from 'lib/principal'

import {
    LoginFormContainer,
} from './login.styles'

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
    const [ loginError, setLoginError ] = useState<string>('')
    const [ waiting, setWaiting ] = useState<boolean>(false)
    const navigate = useNavigate()
    const principal = usePrincipal()
    const location = useLocation() as Location

    const to = location.state?.from?.pathname || '/console'


    const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>)  => {
        setUsername(event.target.value)
    }

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>)  => {
        setPassword(event.target.value)
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
                
        event.preventDefault()

        setWaiting(true)
        auth.signin(username, password).then( async () => {
            await principal.identity(true) // force identity update based on login
            setWaiting(false)
            navigate(to, { replace: true })
        }).catch((ex: unknown) => {
            setWaiting(false)
            if(ex instanceof Error) {
                setLoginError(ex.message)
            }
        })
    }

    const onModalClose = () => {
        setLoginError('')
    }

    return <PublicBase>         
        <Container>
            <LoginFormContainer>
                <Form  onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" autoCorrect='off' name='username' defaultValue={username} onChange={onChangeUsername}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name='password' defaultValue={password} onChange={onChangePassword}/>
                    </Form.Group>
                    <ButtonWithSpinner variant="primary" type="submit" className='mt-3' waiting={waiting}>
                        Log In
                    </ButtonWithSpinner>                        
                </Form>
                <Modal show={Boolean(loginError)}  onHide={onModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{loginError}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={onModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>                
            </LoginFormContainer>
        </Container>
    </PublicBase>

}

export default Login
