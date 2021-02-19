import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'

import Recording from './recording/Recording'
import MainMenu from './components/MainMenu'
import VerifyToken from './components/VerifyToken'

function App () {
  return (
    <div>
      <Router>
        <Route path='/' component={MainMenu}/>

        <Route path='/verify-token' component={VerifyToken} />

        <Route exact path='/'>
          <Recording />
        </Route>
        <Route exact path='/:lat/:lng/:zm'>
          <Recording />
        </Route>

      </Router>

    </div>
  )
}

export default App
