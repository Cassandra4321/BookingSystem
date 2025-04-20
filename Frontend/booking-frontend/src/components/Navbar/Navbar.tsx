import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

import './Navbar.css'

export function Navbar() {
    const { isLoggedIn, login, logout, message } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <Link to="/" className="btn btn-zen fw-bold fs-4">ZenGym</Link>
                <Link to="/classes" className="nav-link">Träningspass</Link>

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
                        <button className="btn btn-sm btn-danger" onClick={logout}>
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