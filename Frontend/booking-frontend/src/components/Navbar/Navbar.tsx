import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../Button/Button.component';
import { AppLinkButton } from '../Link/Link.component';
import './Navbar.css'
import { Navbar, Nav, NavDropdown, Container, Form } from 'react-bootstrap';

export function AppNavbar() {
    const { isLoggedIn, login, logout, message } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
        navigate('/');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
       <Navbar expand="lg" className="px-4 navbar-light sticky-navbar">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 zengym-title">ZenGym</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar" className="w-100 d-flex justify-content-between align-items-center">
                    <Nav className="mx-auto">
                    <NavDropdown title={
                        <span className="dropdown-title">Träning<span className="dropdown-arrow">▾</span></span>} 
                            id="training-dropdown" 
                            className="text--size-small">
                        <NavDropdown.Item as={Link} to="/classes">Boka pass</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title={
                        <span className="dropdown-title">Mina sidor <span className="dropdown-arrow">▾</span></span>}
                            id="user-dropdown"
                            className="text--size-small">
                        <NavDropdown.Item as={Link} to="/user">Mina bokningar</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>


                        <div className="d-flex align-items-center">
                            {!isLoggedIn ? (
                                <>
                                    <Form className="d-flex me-3" onSubmit={handleLogin}>
                                        <Form.Control
                                            type="email"
                                            placeholder="E-post"
                                            size="sm"
                                            className="me-2"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <Form.Control
                                            type="password"
                                            placeholder="Lösenord"
                                            size="sm"
                                            className="me-2"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <AppButton type="submit">
                                            Logga in
                                        </AppButton>
                                    </Form>
                                    <AppLinkButton to="/register">Registrera</AppLinkButton>
                                </>
                            ) : (
                                <AppButton type="reset" onClick={handleLogout} disabled={false}>
                                    Logga ut
                                </AppButton>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {message && (
                <div className="container mt-2">
                    <div className="alert alert-info">{message}</div>
                </div>
            )}
        </>
    );
}