import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Ticket, PlusCircle, Settings, Moon, Sun } from 'lucide-react';
import logo from '../assets/logo.png';

/* 
  Navbar component.
  Reason: Navigation links ab dynamic hone chahiye based on Role (Admin/User).
*/
const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Dark Mode State
    const [darkMode, setDarkMode] = useState(false);

    // Check Current Role
    const role = localStorage.getItem('userRole'); // 'admin' | 'user'

    useEffect(() => {
        // Init theme from preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.body.classList.add('dark');
        } else {
            setDarkMode(false);
            document.body.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (darkMode) {
            document.body.classList.remove('dark');
            localStorage.theme = 'light';
            setDarkMode(false);
        } else {
            document.body.classList.add('dark');
            localStorage.theme = 'dark';
            setDarkMode(true);
        }
    };

    const isActive = (path) => {
        // Active link pe extra background aur text brightness
        return location.pathname === path ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-100 hover:bg-opacity-20';
    };

    const handleLogout = () => {
        /* 
           Logout Logic:
           1. Clear LocalStorage keys.
           2. Navigate to Login page.
        */
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        /* 
           Navbar Styling Updates:
           - Fixed positioning fix kiya.
           - 'top-4' thoda upar shift kiya.
           - Width adjust ki.
        */
        /* 
           Wrapper Fragment because we now have two top-level elements:
           1. Floating Navbar (Top)
           2. Floating Dark Mode Toggle (Bottom Right)
        */
        <>
            <nav className="Margin top-4 left-1/2 transform -translate-x-1/2 w-[40%] max-w-6xl z-50 glass rounded-2xl px-6 py-2 flex justify-between items-center transition-all duration-300 shadow-2xl">

                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    {/* 
                       Logo Size Increased
                       Reason: Quick Smart Wash logo should match button height (approx 48px / h-12).
                    */}
                    <img
                        src={logo}
                        alt="Quick Smart Wash Logo"
                        className="w-10 h-10 object-contain rounded-full shadow-md bg-white p-1"
                    />
                    <h1 className="text-xl font-bold text-main hidden md:block tracking-tight">
                        Quick Smart Wash <span className="text-primary text-xs font-normal align-top">Pvt Ltd.</span>
                    </h1>
                </div>

                {/* Navigation Links - Role Based */}
                <div className="flex items-center gap-4">

                    {/* Dashboard Link */}
                    <Link
                        to={role === 'admin' ? "/admin-dashboard" : "/user-dashboard"}
                        className={`nav-link font-medium flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive(role === 'admin' ? '/admin-dashboard' : '/user-dashboard')}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="hidden md:inline">Dashboard</span>
                    </Link>

                    {/* Role Specific Links */}
                    {role === 'admin' ? (
                        <>
                            <Link
                                to="/tickets"
                                className={`nav-link font-medium flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive('/tickets')}`}
                            >
                                <Ticket size={20} />
                                <span className="hidden md:inline">All Tickets</span>
                            </Link>
                            <button className="nav-link font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 hover:bg-opacity-20 text-secondary hover:text-primary">
                                <Settings size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/tickets"
                                className={`nav-link font-medium flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive('/tickets')}`}
                            >
                                <Ticket size={20} />
                                <span className="hidden md:inline">My Tickets</span>
                            </Link>

                            <Link
                                to="/create-ticket"
                                className="btn btn-primary flex items-center gap-2 text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                <PlusCircle size={18} />
                                <span>New Ticket</span>
                            </Link>
                        </>
                    )}

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-300 mx-2 opacity-50"></div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="nav-link btn-logout flex items-center gap-2 px-4 py-2 rounded-xl"
                        title="Logout"
                    >
                        <LogOut size={20} />
                        <span className="hidden md:inline font-medium">Logout</span>
                    </button>
                </div>
            </nav>

            {/* 
               Dark Mode Floating Action Button (Bottom Right)
               Reason: User requested to shift it to the bottom right corner.
            */}
            <button
                onClick={toggleTheme}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg shadow-2xl border border-white border-opacity-20 hover:scale-110 transition-all duration-300 group"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {darkMode ?
                    <Sun size={24} className="text-yellow-400 group-hover:rotate-45 transition-transform duration-500" /> :
                    <Moon size={24} className="text-gray-600 dark:text-gray-300 group-hover:-rotate-12 transition-transform duration-500" />
                }
            </button>
        </>
    );
};

export default Navbar;
