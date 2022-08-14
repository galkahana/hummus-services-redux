import React from 'react'

import PublicBase from 'components/public-base'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faBolt, faGlobe, faClock } from '@fortawesome/free-solid-svg-icons'
import { InlineList, InlineListItem, UnstyledList } from 'components/common.styles'

import {
    TitleSection,
    FeaturesSection,
    SignupSection,
} from './welcome.styles'



const Welcome = () => {
    return <PublicBase>
        <TitleSection>
            <h1>PDF Creation In the Cloud</h1>
            <h2>PDFHummus Services is a PDF Generation backend for client and server applications</h2>
        </TitleSection>
        <FeaturesSection>
            <InlineList>
                <InlineListItem>
                    <div><FontAwesomeIcon icon={faCheck} /></div>
                    <div>Easy to Use</div>
                </InlineListItem>
                <InlineListItem>
                    <div><FontAwesomeIcon icon={faBolt} /></div>
                    <div>Fast Generation and Delivery</div>
                </InlineListItem>
                <InlineListItem>
                    <div><FontAwesomeIcon icon={faGlobe} /></div>
                    <div>Accessible From Any Application</div>
                </InlineListItem>
                <InlineListItem>
                    <div><FontAwesomeIcon icon={faClock} /></div>
                    <div>Permanent Storage</div>
                </InlineListItem>
            </InlineList>
        </FeaturesSection>
        <SignupSection>
            <UnstyledList>
                <li>
                    <Link to="/signup">
                        <Button variant="outline-dark">Sign Up</Button>
                    </Link>
                </li>
            </UnstyledList>
        </SignupSection>
    </PublicBase>

}

export default Welcome