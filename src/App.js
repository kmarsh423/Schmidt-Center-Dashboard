import './App.css';
import NavBar from './components/NavBar.js';
import Home from './pages/Home.js';
import DashBoard from './pages/DashBoard.js';
import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  //Link,
  Routes
} from 'react-router-dom';

export default function App() {
  document.title = 'Schmidt Center Dashboard'
  return (
    <Router>
      <div className='min-h-full'>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/DashBoard' element={<DashBoard />} />
        </Routes>
      </div>
    </Router>
  );
}
