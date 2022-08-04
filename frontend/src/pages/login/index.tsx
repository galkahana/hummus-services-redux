import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import {  useNavigate, useLocation } from 'react-router-dom'

import PublicBase from 'components/public-base'
import auth from 'lib/auth'

import {
    LoginFormContainer,
    AwaitableActionPanel,
    AwaintableElement
} from './login.styles'



const Login = () => {
    const [ username, setUsername ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ loginError, setLoginError ] = useState<string>('')
    const [ waiting, setWaiting ] = useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation()

    const to = location.state?.from?.pathname || '/console'


    const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>)  => {
        setUsername(event.target.value)
    }

    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>)  => {
        setPassword(event.target.value)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
                
        event.preventDefault()

        setWaiting(true)
        auth.signin(username, password).then(() => {
            setWaiting(false)
            navigate(to, { replace: true })
        }).catch((ex: unknown) => {
            setWaiting(false)
            if(ex instanceof Error) {
                setLoginError(ex.message)
            }
        })
    }

    const clearLoginError = () => {
        setLoginError('')
    }

    return <PublicBase>         
        <Container>
            <LoginFormContainer>
                <Form  onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" autoCorrect='off' name='username' defaultValue={username} onChange={onChangeUsername}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name='password' defaultValue={password} onChange={onChangePassword}/>
                    </Form.Group>
                    <AwaitableActionPanel>
                        <Button variant="primary" type="submit">
                        Log In
                        </Button>
                        {waiting &&
                        (<Spinner
                            variant="primary"
                            as={AwaintableElement}
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />)}
                    </AwaitableActionPanel>
                </Form>
                <Modal show={Boolean(loginError)}  onHide={clearLoginError}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{loginError}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={clearLoginError}>Close</Button>
                    </Modal.Footer>
                </Modal>                
            </LoginFormContainer>
        </Container>
    </PublicBase>

}

export default Login
