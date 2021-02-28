import React from 'react'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import './App.css'

import Recording from './recording/Recording'
import MainMenu from './components/MainMenu'
import HowTo from './components/HowTo'
import Impressum from './components/Impressum'
import VerifyToken from './components/VerifyToken'

export const DEFAULT_MAP_POSITION = {
  lat: 52.501389, // Center of Berlin
  lng: 13.4025,
  zm: 10,
}

function App() {
  return (
    <div>
      <Router>
        <Route path='/' component={MainMenu}></Route>
        <Route path='/home'>
          <Redirect to='/' />
        </Route>

        <Route exact path='/'>
          <Redirect
            to={`/${DEFAULT_MAP_POSITION.lat}/${DEFAULT_MAP_POSITION.lng}/${DEFAULT_MAP_POSITION.zm}`}
          />
        </Route>
        <Route exact path='/howto' component={HowTo} />
        <Route exact path='/impressum' component={Impressum} />
        <Route path='/verify-token' component={VerifyToken} />
        <Route exact path='/:lat/:lng/:zm' component={Recording} />
      </Router>
    </div>
  )
}

export default App
