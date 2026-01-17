import React from 'react'
import { Outlet } from 'react-router'

const Root = () => {
  return (
    <>
    <main>
      <Outlet />
    </main>
    </>
  )
}

export default Root
