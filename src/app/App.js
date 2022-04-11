import React from 'react'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import './App.css'

import Recording from './recording/Recording'
import MainMenu from './components/MainMenu'
import HowTo from './components/HowTo'
import Impressum from './components/Impressum'
import DataPolicy from './components/DataPolicy'
import { UserProvider } from './context/UserContext'
import isEmbedded from '../helpers/isEmbedded'

// Center of Berlin
export const DEFAULT_MAP_POSITION = {
  lat: 52.501389,
  lng: 13.4025,
  zm: 10,
}

function App() {
  return (
    <React.StrictMode>
      <UserProvider>
        <Router>
          {!isEmbedded && <Route path='/' component={MainMenu}></Route>}
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
          <Route path='/:lat/:lng/:zm'>
            <Recording/>
          </Route>
        </Router>
      </UserProvider>
    </React.StrictMode>
  )
}

export default App
