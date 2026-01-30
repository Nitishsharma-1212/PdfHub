import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, ChevronRight, Home, Grid, Move, Minimize } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Merge', path: '/merge-pdf', icon: Grid },
        { name: 'Split', path: '/split-pdf', icon: Move },
        { name: 'Compress', path: '/compress-pdf', icon: Minimize },
    ];

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">

                    {/* Logo Section */}
                    <Link to="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
                        <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary to-rose-600 text-white shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-primary/40 group-hover:scale-105 group-hover:-rotate-3">
                            <FileText size={22} strokeWidth={2.5} className="relative z-10" />
                            <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-none group-hover:text-primary transition-colors">
                                PDF<span className="text-primary">Hub</span>
                            </span>
                            <span className="text-[0.6rem] md:text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                                Professional Tools
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center p-1.5 bg-white/60 backdrop-blur-md rounded-full border border-white/50 shadow-sm ring-1 ring-black/5">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${active
                                        ? 'bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                                        }`}
                                >
                                    <Icon size={16} strokeWidth={2.5} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/admin/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">
                            Log in
                        </Link>
                        <Link to="/" className="group relative px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/20 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started <ChevronRight size={16} strokeWidth={3} />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2 text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50 active:scale-95"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white/95 backdrop-blur-2xl transition-all duration-500 md:hidden z-40 flex flex-col pt-24 px-6 ${isOpen
                ? 'opacity-100 pointer-events-auto translate-y-0'
                : 'opacity-0 pointer-events-none -translate-y-8'
                }`}>
                <div className="flex flex-col gap-3">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all duration-300 ${active
                                    ? 'bg-primary/5 text-primary border border-primary/10 pl-6'
                                    : 'text-slate-600 hover:bg-slate-50 hover:pl-6'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <div className={`p-2 rounded-lg ${active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <Icon size={20} />
                                </div>
                                {link.name}
                                {active && <ChevronRight size={20} className="ml-auto" />}
                            </Link>
                        );
                    })}

                    <div className="h-px bg-slate-100 my-4" />

                    <div className="flex flex-col gap-4">
                        <Link to="/admin/login" onClick={() => setIsOpen(false)} className="w-full py-4 rounded-xl text-center font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                            Log in
                        </Link>
                        <Link to="/" onClick={() => setIsOpen(false)} className="w-full py-4 rounded-xl text-center font-bold text-white bg-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
