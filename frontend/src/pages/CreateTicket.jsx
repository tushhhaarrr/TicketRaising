import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { addTicket } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Hardware',
        priority: 'Low',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Add to mock DB
        addTicket({
            subject: formData.title,
            category: formData.category,
            status: 'Pending',
            user: localStorage.getItem('userName') || 'Employee',
            date: new Date().toISOString().split('T')[0],
            description: formData.description
        });

        // Redirect to dashboard
        // Agar admin hai to admin dashboard, else user dashboard
        const role = localStorage.getItem('userRole');
        navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <GlassCard>
                <h2 className="text-2xl font-bold mb-6 text-primary">Describe your issue</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div>
                        <label className="block mb-2 font-medium">Issue Title</label>
                        <input
                            type="text"
                            name="title"
                            className="input-field"
                            placeholder="e.g., Application crashing on login"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <p className="text-xs text-secondary mt-1">Keep it short and descriptive.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">Category</label>
                            <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                                <option>Hardware</option>
                                <option>Software</option>
                                <option>Network</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Priority</label>
                            <select name="priority" className="input-field" value={formData.priority} onChange={handleChange}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            className="input-field"
                            placeholder="Please minimize technical jargon..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button type="button" onClick={() => navigate(-1)} className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="btn btn-primary flex-1">Submit Ticket</button>
                    </div>

                </form>
            </GlassCard>
        </div>
    );
};

export default CreateTicket;
