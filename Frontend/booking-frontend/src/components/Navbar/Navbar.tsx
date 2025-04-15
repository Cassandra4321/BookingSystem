import { Link } from 'react-router-dom';
import  React, { useEffect, useState } from 'react';
import { ApiClient, Login } from '../../Domain/client';
import './Navbar.css'

export function Navbar() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const client = new ApiClient("https://localhost:7193")

        const loginData = new Login();
        loginData.email = email;
        loginData.password = password;
    
        try {
            const token = await client.login(loginData); 
            localStorage.setItem('token', token as unknown as string); 
            setIsLoggedIn(true);
            setMessage("Inloggning lyckades!");
            setTimeout(() => {
                setMessage(null);
            }, 2000)
        } catch (error) {
            console.error(error);
            setMessage("Fel vid inloggning.");
            setTimeout(() => {
                setMessage(null);
            }, 3000)
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
        setMessage(null);
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <div className="container-fluid d-flex justify-content-between align-items-center">

                <Link to="/" className="btn btn-primary fw-bold fs-4">Hem</Link>

                <div className="d-flex align-items-center">
                    {!isLoggedIn ? (
                        <>
                            <form className="d-flex me-3" onSubmit={handleLogin}>
                                <input
                                    type="email"
                                    className="form-control form-control-sm me-2"
                                    placeholder="E-post"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    className="form-control form-control-sm me-2"
                                    placeholder="Lösenord"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-sm btn-outline-success">Logga in</button>
                            </form>
                            <Link to="/register" className="btn btn-sm btn-outline-primary">Registrera</Link>
                        </>
                    ) : (
                        <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                            Logga ut
                        </button>
                    )}
                </div>
            </div>
            {message && (
                <div className="container mt-2">
                    <div className="alert alert-info">{message}</div>
                </div>
            )}
        </nav>
        
    );
}