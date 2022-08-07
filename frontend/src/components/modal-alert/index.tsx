import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ReactMarkdown from 'react-markdown'

export type ModalAlertProps = {
    title?: string
    body: string
    show: boolean
    onDismiss: () => void
}


const ModalAlert = ({ title, body, show, onDismiss }: ModalAlertProps) => (
    <Modal show={show}  onHide={onDismiss}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body><ReactMarkdown children={body}/></Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={onDismiss}>Close</Button>
        </Modal.Footer>
    </Modal>  
)

export default ModalAlert