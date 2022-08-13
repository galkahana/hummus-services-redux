import React, { useState, useEffect, useCallback } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

import hummusClientService from 'lib/hummus-client/service'
import { useModalAlert } from 'components/modal-alert/context'
import { createEnhancedError } from 'lib/api-helpers/EnhancedError'

import { PlanPanelContainer } from './api-keys-panel.styles'
import { UnstyledList } from 'components/common.styles'
import { useToast } from 'components/toast'

const ApiKeysPanel = () => {
    const [ publicKey, setPublicKey ] = useState<string>()
    const [ creatingPublicKey, setCreatingPublicKey ] = useState<boolean>()
    const [ deletingPublicKey, setDeletingPublicKey ] = useState<boolean>()
    const [ restrictedDomainsPublic, setRestrictedDomainsPublic ] = useState<Nullable<string[]>>([])
    const [ domainRestrictAdd, setDomainRestrictAdd ] = useState<string>('')
    const [ privateKey, setPrivateKey ] = useState<string>()
    const [ creatingPrivateKey, setCreatingPrivateKey ] = useState<boolean>()
    const [ deletingPrivateKey, setDeletingPrivateKey ] = useState<boolean>()

    const showModalAlert = useModalAlert()
    const showToast = useToast()

    useEffect(()=> {
        hummusClientService.getTokens().then((tokens) => {
            setPublicKey(tokens.public?.token)
            setPrivateKey(tokens.private?.token)
            setRestrictedDomainsPublic(tokens.public?.restrictedDomains || null)
        }).catch((ex: unknown) => {
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error fetching the tokens but it won\'t tell us what it was.', 'Tokens Error')
        })
    }, [ showModalAlert ])

    const onCreatePublicKeyClick = useCallback(()=>{
        setCreatingPublicKey(true)
        hummusClientService.createPublicAPIToken(restrictedDomainsPublic).then(({ token }) => {
            setPublicKey(token)
            setCreatingPublicKey(false)
        }).catch((ex: unknown) => {
            setCreatingPublicKey(false)
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error creating public key but it won\'t tell us what it was.', 'Tokens Error')
        })
    }, [ showModalAlert, restrictedDomainsPublic ])

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
    
    const updateRestrictedDomainsPublic = useCallback((restrictedDomains?: Nullable<string[]>)=> {
        hummusClientService.patchPublicAPIToken(restrictedDomains).then(() => {
            showToast('Updated restricted domains for public token')
        }).catch((ex: unknown) => {
            showModalAlert(createEnhancedError(ex).getErrorMessage() || 'The was an error updating public key domains but it won\'t tell us what it was.', 'Tokens Error')
        })
    }, [ showModalAlert, showToast ])

    const onDomainRestrictDeleteClick = useCallback( (i: number) => {
        if(!restrictedDomainsPublic) // not technically possible but lets be nice to typescript
            return

        const newDomains = [ ...restrictedDomainsPublic.slice(0, i), ...restrictedDomainsPublic.slice(i+1) ]
        setRestrictedDomainsPublic(newDomains)
        updateRestrictedDomainsPublic(newDomains)
    }, [ restrictedDomainsPublic, updateRestrictedDomainsPublic ])



    const onDomainRestrictAddClick = useCallback(() => {
        const newDomains = [ ...(restrictedDomainsPublic || []), domainRestrictAdd ]
        setRestrictedDomainsPublic([ ...(restrictedDomainsPublic || []), domainRestrictAdd ])
        setDomainRestrictAdd('')
        updateRestrictedDomainsPublic(newDomains)
    }, [ restrictedDomainsPublic, domainRestrictAdd, updateRestrictedDomainsPublic ])

    const onDomainRestrictAddChange = useCallback((event: React.ChangeEvent<HTMLInputElement>)=> {
        setDomainRestrictAdd(event.target.value)
    }, [])


    
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
            <Col md={{ span:11, offset:1 }}>
                <label>
                    Restrict to the following domains:
                </label>
                <UnstyledList>
                    {
                        (restrictedDomainsPublic || []).map((restrictedDomain, index) => 
                            <li key={index}>
                                <Row>
                                    <Col sm={1}>
                                        <FontAwesomeIcon icon={faTrash} onClick={()=>{onDomainRestrictDeleteClick(index)}}/>
                                    </Col>
                                    <Col sm={11}>
                                        {restrictedDomain}
                                    </Col>
                                </Row>
                            </li>
                        )
                    }
                    <li>
                        <Form.Group as={Row}>
                            <Form.Label column sm={1}><FontAwesomeIcon icon={faPlus} onClick={()=>{onDomainRestrictAddClick()}}/></Form.Label>
                            <Col sm={7}>
                                <Form.Control type="text" autoCorrect="off" autoCapitalize='off' value={domainRestrictAdd} onChange={onDomainRestrictAddChange}/>
                                <Form.Text muted>
                                    <small>add a domain or subdomain here to restrict public key access to that particular source (www.example.com or example.com). For localhost add the port as well (e.g. localhost:5050)</small>
                                </Form.Text>                                  
                            </Col>
                        </Form.Group>
                    </li>                        
                </UnstyledList>
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