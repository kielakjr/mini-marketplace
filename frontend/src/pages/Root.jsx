import React from 'react'
import { Outlet } from 'react-router'
import MainNavigation from '../components/MainNavigation'
import Background from '../components/ui/Beams'

const Root = () => {
  return (
    <>
    <Background />
    <MainNavigation />
    <main>
      <Outlet />
    </main>
    </>
  )
}

export default Root
