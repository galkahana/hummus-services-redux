import React, { useState } from 'react'

import md5  from 'blueimp-md5'

import { AvatarContainer } from './avatar.styles'

type AvatarProps = {
    username?: string
}

const avatarLetter = (username?: string) => {
    if(!username) return 'O'
    return username.length > 0 ? username[0]:'O'
}

function usernameHash(username: string) {
    return md5(username.trim().toLowerCase())
}

const imageUrl = (username?: string) => {
    if(!username) return '' 
    
    return 'https://www.gravatar.com/avatar/' + usernameHash(username) + '?s=50&d=blank'
}


const Avatar = ( { username }: AvatarProps) => {
    const [ isError, setError ] = useState<Boolean>(false)

    const onImageError = (_: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setError(true)
    }

    const onImageLoad = (_: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setError(false)
    }
    

    return (
        <AvatarContainer>
            <span className="avatar-letter">{avatarLetter(username)}</span>
            <img className={isError ? 'agatar-image-error': 'avatar-image'} src={imageUrl(username)} onError={onImageError} onLoad={onImageLoad} alt="avatar"></img>
        </AvatarContainer>
    )
}

export default Avatar