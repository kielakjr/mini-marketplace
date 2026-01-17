import React from 'react'
import Button from './Button'

const LoginButton = ({...props}) => {
  return (
    <Button
      {...props}>
      Login
    </Button>
  )
}

export default LoginButton
