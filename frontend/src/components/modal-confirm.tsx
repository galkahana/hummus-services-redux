import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ReactMarkdown from 'react-markdown'

type ModalAlertProps = {
    title?: string
    body: string
    show: boolean
    confirmText?: string
    rejectText?: string
    onReject: () => void| Promise<void>
    onConfirm: () => void | Promise<void>
}


const ModalConfirm = ({ title, body, show, onReject, onConfirm, confirmText, rejectText }: ModalAlertProps) => (
    <Modal show={show}  onHide={onReject}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body><ReactMarkdown children={body}/></Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={onConfirm}>{confirmText || 'OK'}</Button>
            <Button variant="secondary" onClick={onReject}>{rejectText || 'Cancel'}</Button>
        </Modal.Footer>
    </Modal>  
)

export default ModalConfirm