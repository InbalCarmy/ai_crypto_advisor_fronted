import {  useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../store/user/user.actions"


export function LoginPage(){
    const [credentials, setCredentials] = useState({name: '', email: '' ,password: ''})
    const navigate = useNavigate()


    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.name) return
        await login(credentials)
        navigate('/dashboard')

    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }



    return(
        <section>
            <form className="login-form" onSubmit={onLogin}>
                <label htmlFor="name">Name:</label>
                <input 
                    type="text"
                    placeholder="Enter name"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    value={credentials.name}
                 />
                <label htmlFor="email">Email:</label>
                <input 
                    type="text"
                    placeholder="Enter email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={credentials.email}
                 />
                <label htmlFor="password">Password:</label>
                <input 
                    type="text"
                    placeholder="Password"
                    id="password"
                    name="password" 
                    onChange={handleChange}
                    value={credentials.password}/>
                <button>Login</button>
                <div>
                    Don't have an account? <Link to="/signup">Signup</Link> 
                </div>                
            </form>

    </section>
    )
}