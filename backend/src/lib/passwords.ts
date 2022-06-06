import * as crypto from 'crypto'

const PASSWORD_LENGTH = 256
const SALT_LENGTH = 64
const ITERATIONS = 10000
const DIGEST = 'sha256'
const BYTE_TO_STRING_ENCODING = 'hex'

export interface PersistedPassword {
    salt: string;
    hash: string;
    iterations: number;
}

export async function generateHashPassword(password: string): Promise<PersistedPassword> {
    return new Promise<PersistedPassword>((resolve, reject) => {
        const salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING)
        crypto.pbkdf2(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (error, hash) => {
            if (error) {
                reject(error)
            } else {
                resolve({
                    salt,
                    hash: hash.toString(BYTE_TO_STRING_ENCODING),
                    iterations: ITERATIONS,
                })
            }
        })
    })
}

export async function verifyPassword(persistedPassword: PersistedPassword, passwordAttempt: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        crypto.pbkdf2(passwordAttempt, persistedPassword.salt, persistedPassword.iterations, PASSWORD_LENGTH, DIGEST, (error, hash) => {
            if (error) {
                reject(error)
            } else {
                resolve(persistedPassword.hash === hash.toString(BYTE_TO_STRING_ENCODING))
            }
        })
    })
}