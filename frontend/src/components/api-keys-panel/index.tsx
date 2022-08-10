import React, { useState, useEffect, useCallback } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import hummusClientService from 'lib/hummus-client/service'
import { useModalAlert } from 'components/modal-alert/context'
import { createEnhancedError } from 'lib/api-helpers/EnhancedError'

import { PlanPanelContainer } from './api-keys-panel.styles'

const ApiKeysPanel = () => {
    const [ publicKey, setPublicKey ] = useState<string>()
    const [ creatingPublicKey, setCreatingPublicKey ] = useState<boolean>()
    const [ deletingPublicKey, setDeletingPublicKey ] = useState<boolean>()
    const [ privateKey, setPrivateKey ] = useState<string>()
    const [ creatingPrivateKey, setCreatingPrivateKey ] = useState<boolean>()
    const [ deletingPrivateKey, setDeletingPrivateKey ] = useState<boolean>()

    const showModalAlert = useModalAlert()

    useEffect(()=> {
        hummusClientService.getTokens().then((tokens) => {
            setPublicKey(tokens.public)
            setPrivateKey(tokens.private)
        }).catch((ex: unknown) => {
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error fetching the tokens but it won\'t tell us what it was.', 'Tokens Error')
        })
    }, [ showModalAlert ])

    const onCreatePublicKeyClick = useCallback(()=>{
        setCreatingPublicKey(true)
        hummusClientService.createPublicAPIToken().then(({ token }) => {
            setPublicKey(token)
            setCreatingPublicKey(false)
        }).catch((ex: unknown) => {
            setCreatingPublicKey(false)
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error creating public key but it won\'t tell us what it was.', 'Tokens Error')
        })
    }, [ showModalAlert ])

    const onDeletePublicKeyClick = useCallback(()=> {
        setDeletingPublicKey(true)
        hummusClientService.deletePublicAPIToken().then(() => {
            setPublicKey('')
            setDeletingPublicKey(false)
        }).catch((ex: unknown) => {
            setDeletingPublicKey(false)
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error deleting public key but it won\'t tell us what it was.', 'Tokens Error')
        })        
    }, [ showModalAlert ])

    const onCreatePrivateKeyClick = useCallback(()=>{
        setCreatingPrivateKey(true)
        hummusClientService.createPrivateAPIToken().then(({ token }) => {
            setPrivateKey(token)
            setCreatingPrivateKey(false)
        }).catch((ex: unknown) => {
            setCreatingPrivateKey(false)
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error creating private key but it won\'t tell us what it was.', 'Tokens Error')
        })
    }, [ showModalAlert ])

    const onDeletePrivateKeyClick = useCallback(()=> {
        setDeletingPrivateKey(true)
        hummusClientService.deletePrivateAPIToken().then(() => {
            setPrivateKey('')
            setDeletingPrivateKey(false)
        }).catch((ex: unknown) => {
            setDeletingPrivateKey(false)
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error deleting private key but it won\'t tell us what it was.', 'Tokens Error')
        })        
    }, [ showModalAlert ])    

    return <PlanPanelContainer>
        <Row>
            <Col md={12}>
                <label className="name">
                Public Key:
                </label>
            </Col>
        </Row>
        <Row>
            <Col md={{ span:11, offset:1 }}>
                <ButtonGroup>
                    <Button className="btn-create" variant="outline-dark" onClick={onCreatePublicKeyClick}>
                        <FontAwesomeIcon icon={!publicKey && !creatingPublicKey ? faPlus: faRefresh} className={creatingPublicKey ? 'spinning':''}/>
                    </Button>
                    <Button className="btn-delete" disabled={!publicKey} variant="outline-dark" onClick={onDeletePublicKeyClick}>
                        <FontAwesomeIcon icon={deletingPublicKey ? faRefresh: faTrash} className={deletingPublicKey ? 'spinning':''}/>
                    </Button>
                </ButtonGroup>
                <div className="key-container">
                    {publicKey || 'N/A'}
                </div>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
                <label className="name">
                Private Key:
                </label>
            </Col>
        </Row>
        <Row>
            <Col md={{ span:11, offset:1 }}>
                <ButtonGroup>
                    <Button className="btn-create" variant="outline-dark" onClick={onCreatePrivateKeyClick}>
                        <FontAwesomeIcon icon={!privateKey && !creatingPrivateKey ? faPlus: faRefresh} className={creatingPrivateKey ? 'spinning':''}/>
                    </Button>
                    <Button className="btn-delete" disabled={!privateKey} variant="outline-dark" onClick={onDeletePrivateKeyClick}>
                        <FontAwesomeIcon icon={deletingPrivateKey ? faRefresh: faTrash} className={deletingPrivateKey ? 'spinning':''}/>
                    </Button>
                </ButtonGroup>
                <div className="key-container">
                    {privateKey || 'N/A'}
                </div>
            </Col>
        </Row>        
    </PlanPanelContainer>
}

export default ApiKeysPanel