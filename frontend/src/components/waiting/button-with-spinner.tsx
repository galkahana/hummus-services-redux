import React from 'react'

import Button, { ButtonProps } from 'react-bootstrap/Button'

import { ButtonSpinnerContent, WaitingProps } from './button-with-spinner.styles'
import Spinner from './spinner'


const ButtonWithSpinner = ({ waiting, variant, children, ...rest }: WaitingProps & ButtonProps) => 
    <Button variant={variant} {...rest}>
        <ButtonSpinnerContent  variant={variant}  waiting={waiting}>
            <div className="default">{children}</div>
            <Spinner/>
        </ButtonSpinnerContent>
    </Button>


export default ButtonWithSpinner