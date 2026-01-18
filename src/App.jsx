
import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AppHeader } from './cmps/AppHeader'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { MainPage } from './pages/MainPage'
import { UserMsg } from './cmps/UserMsg'

function App() {

  return (
    <>
    <AppHeader/>
    <UserMsg />
    <main>
      <Routes>
        <Route path ="/" element ={<HomePage/>}/>
        <Route path ="/login" element ={<LoginPage/>}/>
        <Route path ="/signup" element ={<SignupPage/>}/>
        <Route path ="/signup/admin" element ={<SignupPage isAdmin={true}/>}/>
        <Route path ="/main" element ={<MainPage/>}/>
      </Routes>      
    </main>

    </>

  )
}

export default App
