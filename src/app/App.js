import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'

import Recording from './recording/Recording'
import MainMenu from './components/MainMenu'
import Welcome from './components/Welcome'
import VerifyToken from './components/VerifyToken'

function App () {
  return (
    <div>
      <Router>
        <Route path='/' component={MainMenu}/>

        <Route path='/welcome' component={Welcome}/>
        <Route path='/verify-token' component={VerifyToken} />

        <Route exact path='/'>
          <Recording />
        </Route>

      </Router>

    </div>
  )
}

export default App
