import React from 'react'

import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import ConsoleBase from 'components/console-base'
import GeneralPanel from 'components/general-panel'
import APIKeysPanel from 'components/api-keys-panel'
import PlanPanel from 'components/plan-panel'

import { AccountPage } from './account.styles'

const Account = () => {
    return (
        <ConsoleBase>
            <AccountPage>
                <Container>
                    <Tabs
                        defaultActiveKey="general"
                        className="tab-pane"
                    >
                        <Tab eventKey="general" title="General">
                            <GeneralPanel/>
                        </Tab>
                        <Tab eventKey="apiKeys" title="API Keys">
                            <APIKeysPanel/>
                        </Tab>
                        <Tab eventKey="plan" title="Plan Usage">
                            <PlanPanel/>
                        </Tab>
                    </Tabs>
                </Container>
            </AccountPage>
        </ConsoleBase>
    )
}

export default Account