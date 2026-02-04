import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';

/* 
  Login Page Component.
  Reason: Users aur Admin dono ke liye common entry point.
  Hum credentials ke basis par decide karenge ki user kaun hai.
*/
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Error state handle karne ke liye
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Jab user type kare toh error hata do
        setError('');
    };

    /* 
       Login Logic Mock Implementation
       Reason: Abhi backend se connect karne se pehle UI flow test kar rahe hain.
       Admin: admin@example.com / admin123
       User: Any other
    */
    const handleSubmit = (e) => {
        e.preventDefault();

        const { username, password } = formData;

        // Validation for Admin
        if (username === 'admin@example.com' && password === 'admin123') {
            /* 
               LocalStorage mein role save kar rahe hain.
               Reason: Poore app mein pata hona chahiye ki banda Admin hai.
            */
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userName', 'Super Admin');
            navigate('/admin-dashboard');
        }
        // Validation for User (Mock)
        else if (username && password) {
            /* 
              LocalStorage mein role save kar rahe hain.
              Reason: Ye normal employee/user hai.
           */
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('userName', 'Employee');
            navigate('/user-dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            {/* Background Gradient */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #E2EBf0 0%, #CFD9DF 100%)',
                zIndex: -1
            }}></div>

            {/* Decorative Elements */}
            <div style={{
                position: 'absolute', top: '20%', left: '30%', width: '300px', height: '300px',
                background: 'rgba(0, 122, 255, 0.2)', filter: 'blur(80px)', borderRadius: '50%', zIndex: -1
            }}></div>

            <GlassCard className="w-full max-w-md m-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
                    <p className="text-secondary">Quick Smart Wash Pvt Ltd.</p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-medium text-sm">Username / Email</label>
                        <input
                            type="text"
                            name="username"
                            className="input-field"
                            placeholder="e.g. admin@example.com"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4">
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-secondary">
                        <strong>Demo Credentials:</strong><br />
                        Admin: admin@example.com / admin123<br />
                        User: employee@test.com / (any pass)
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
