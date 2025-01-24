import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import InvoicePreview from './components/InvoicePreview';
import Example from './components/example';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/preview' element={<InvoicePreview />} />
        <Route path='/example' element={<Example />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App