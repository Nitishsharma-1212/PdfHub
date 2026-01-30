import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ToolCard from '../components/ToolCard';

const Home = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await axios.get('/api/tools');
                setTools(response.data);
            } catch (err) {
                console.error('Failed to fetch tools', err);
                // Set error state to display to user
                setTools([]);
                // We'll use a hack here to pass the error message to the render
                window.lastError = err.message || 'Unknown error';
            } finally {
                setLoading(false);
            }
        };
        fetchTools();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-slate-700 text-sm font-bold tracking-wide shadow-sm animate-fade-in">
                        ✨ #1 Free Online PDF Tools
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-[800] tracking-tight mb-8 text-slate-900 break-words max-w-5xl mx-auto leading-[1.1] animate-fade-up">
                        We make PDF tools <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">easy and professional.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto mb-10 px-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        Process your files with our suite of powerful, free tools.
                        No registration required. Secure, fast, and reliable.
                    </p>
                    <div className="flex justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/merge-pdf" className="px-10 py-4 rounded-full bg-slate-900 text-white font-bold text-base tracking-wide shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                            Get Started
                        </Link>
                        <Link to="/compress-pdf" className="px-10 py-4 rounded-full bg-white text-slate-900 font-bold text-base tracking-wide shadow-xl shadow-slate-200/50 hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300">
                            Explore Tools
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tools Grid Section */}
            <div className="py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between mb-10 max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900">Most Popular Tools</h2>
                        <div className="h-px flex-1 bg-slate-200 ml-8 hidden md:block"></div>
                    </div>

                    {tools.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                            {tools.map(tool => (
                                <ToolCard key={tool._id} tool={tool} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                            <p className="text-red-500 font-bold text-lg mb-2">Failed to load tools</p>
                            <p className="text-slate-500">Please check your database connection or try refreshing.</p>
                            <p className="text-xs text-red-400 mt-4 font-mono">{window.lastError}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
