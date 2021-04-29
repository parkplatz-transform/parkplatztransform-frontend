import React from 'react'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import './App.css'

import Recording from './recording/Recording'
import MainMenu from './components/MainMenu'
import HowTo from './components/HowTo'
import Impressum from './components/Impressum'
import DataPolicy from './components/DataPolicy'
import { UserProvider } from './context/UserContext'

export const DEFAULT_MAP_POSITION = {
  lat: 52.501389, // Center of Berlin
  lng: 13.4025,
  zm: 10,
}

function App() {
  return (
    <UserProvider>
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
        <Route exact path='/datenschutz' component={DataPolicy} />
        <Route exact path='/:lat/:lng/:zm' component={Recording} />
      </Router>
    </UserProvider>
  )
}

export default App
