import React, { useState } from 'react';
import { ApiClient, Register } from '../../domain/client'
import { Navbar } from '../../components/Navbar/Navbar';

export function RegisterPage() {
    const [formData, setFormData] = useState<Register>(new Register());
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = new Register();
        Object.assign(updated, formData, { [name]: value });
        setFormData(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const client = new ApiClient("https://localhost:7193");

        try {
            await client.register(formData);
            setMessage("Registreringen lyckades!");
        } catch (error) {
            console.error(error);
            setMessage("Registrering misslyckades.");
        }
    };

    return (
        <div>
        <Navbar />
        <div className="container mt-5">
            <h2>Registrera dig</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Förnamn</label>
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Efternamn</label>
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">E-post</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Lösenord</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Registrera</button>
            </form>
            {message && <div className="mt-3 alert alert-info">{message}</div>}
        </div>
        </div>
    );
}