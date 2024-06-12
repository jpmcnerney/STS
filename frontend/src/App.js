import './App.scss';
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import Layout from './components/Layout'
import Info from './components/Info'
import Contact from './components/Contact'

function App() {
  return (
    <>
    <Routes>
      <Route path = "/" element = {<Layout />}>
        <Route index element = {<Main />} />
        <Route path = "info" element = {<Info />} />
        <Route path = "contact" element = {<Contact />} />
      </Route>
    </Routes>
    </>
  )
}

export default App;