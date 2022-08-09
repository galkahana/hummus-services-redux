import config from 'config'
import sg from '@sendgrid/mail'
import fs from 'fs'
import path from 'path'
import MarkdownIt from 'markdown-it'

import mustache from '@lib/mustache'
import { IUser } from '@models/users/types'

const assetsPath = path.resolve(__dirname, '../../assets/')
const JOINED_USER_EMAIL = fs.readFileSync(path.resolve(assetsPath, './email-templates/joined-user-email.md'), 'utf8')
const JOINED_ADMIN_EMAIL = fs.readFileSync(path.resolve(assetsPath, './email-templates/joined-admin-email.md'), 'utf8')
const ADMIN_EMAIL = config.get<string>('emails.adminEmail')
const JOIN_EMAIL = config.get<string>('emails.joinEmail')
const SUPPORT_EMAIL = config.get<string>('emails.supportEmail')
const EMAIL_SERVICE_URL = config.get<string>('emails.serviceURL')

// create markdown engine
const markdown = new MarkdownIt()

// setup sg with key
sg.setApiKey(config.get<string>('sendgrid.apiKey'))


function _sendEmail(from: string, to: string, subject: string, html: string) {
    const msg = {
        to,
        from,
        subject,
        html,
    }

    return sg.send(msg)
}

export function sendTestEmail(from: string, to: string) {
    return _sendEmail(
        from,
        to,
        'This is a test email',
        'Hello! this is a test email using the sendgrid lib',
    )
}

export function sendUserJoinedAdminEmail(user: IUser) {
    return _sendEmail(
        ADMIN_EMAIL,
        JOIN_EMAIL,
        'User ' + user.uid + ' Joined',
        markdown.render(mustache.render(JOINED_ADMIN_EMAIL, {
            name: user.name,
            username: user.username,
            email: user.email,
            uid: user.uid
        })),

    )
}

export function sendUserJoinedWelcomeEmail(user: IUser) {
    return _sendEmail(
        JOIN_EMAIL,
        user.email,
        'Welcome to PDFHummus Services',
        markdown.render(mustache.render(JOINED_USER_EMAIL, {
            name: user.name,
            username: user.username,
            supportEmail: SUPPORT_EMAIL,
            serviceUrl: EMAIL_SERVICE_URL
        })),

    )
}