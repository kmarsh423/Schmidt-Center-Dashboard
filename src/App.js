import './App.css';
import NavBar from './components/NavBar.js'
import Home from './pages/Home.js'
import Map from './pages/Map.js'
import React from 'react';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
} from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="min-h-full">
      <NavBar/>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Map" element={<Map/>}/>
      </Routes>
      </div>
    </Router>
  )
}
