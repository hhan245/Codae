"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:1337/api/auth/local/register', {
                email: formData.email,
                password: formData.password,
                username: formData.email // Adjust if username is required
            });

            console.log('Response:', response);

            if (response.data) {
                console.log('Registration successful:', response.data);
                // Optionally, handle success (e.g., redirect to login page)
                setError('');
                // Clear form after successful registration (optional)
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
            } else {
                console.error('Empty response received');
                setError('Empty response received from server.');
            }
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);

            // Handle specific error for email already in use
            if (error.response && error.response.data && error.response.data.message && error.response.data.message.includes('Email is already taken')) {
                setError('Email is already in use');
            } else {
                setError('Email is already in use.'); // Generic error message for other errors
            }
        }
    };

    return (
        <section style={{ backgroundColor: '#ffffff', color: '#1f2937', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'ALEGREYA-REGULAR' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
                <div className="pb-5">
                    <img style={{ width: '60px', height: '60px', marginRight: '8px', borderRadius: '50%' }} src="images/logo-codae-symbol.png" alt="logo" />
                </div>
                <div style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
                    
                        <div>
                            <label htmlFor="email" style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Email</label>
                            <input type="email" name="email" id="email" style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937', fontSize: '14px', borderRadius: '8px', border: '1px solid', width: '100%', padding: '10px' }} placeholder="name@gmail.com" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="password" style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Password</label>
                            <input type="password" name="password" id="password" style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937', fontSize: '14px', borderRadius: '8px', border: '1px solid', width: '100%', padding: '10px' }} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>Confirm Password</label>
                            <input type="password" name="confirmPassword" id="confirm-password" style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937', fontSize: '14px', borderRadius: '8px', border: '1px solid', width: '100%', padding: '10px' }} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        {error && <span style={{ color: 'red' }}>{error}</span>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input id="terms" type="checkbox" style={{ width: '16px', height: '16px', backgroundColor: '#ffffff', borderColor: '#d1d5db', borderRadius: '4px', marginRight: '8px' }} required />
                                <label htmlFor="terms" style={{ fontSize: '14px', color: '#6b7280' }}>I accept the <a href="#" style={{ color: 'black' }}>Terms and Conditions</a></label>
                            </div>
                        </div>
                        <button type="submit" style={{ backgroundColor: 'black', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', cursor: 'pointer' }}>
                            Create an Account
                        </button>
                        <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
                            Already have an account? <Link href="/login" passHref legacyBehavior><a style={{ color: 'black' }}>Login here</a></Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;
