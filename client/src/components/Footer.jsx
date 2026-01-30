import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-slate-900 text-white py-16 border-t border-slate-800 mt-auto overflow-hidden">
            {/* Decorative background effects */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
            <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-100px] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-2xl font-extrabold tracking-tight">PDF<span className="text-primary">Hub</span></span>
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-6 font-medium">
                            The ultimate all-in-one PDF solution for professionals, students, and businesses. Secure, fast, and free.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white tracking-wide">Product</h4>
                        <ul className="space-y-3 text-slate-400 font-medium">
                            <li><Link to="/merge-pdf" className="hover:text-primary transition-colors duration-300">Merge PDF</Link></li>
                            <li><Link to="/split-pdf" className="hover:text-primary transition-colors duration-300">Split PDF</Link></li>
                            <li><Link to="/compress-pdf" className="hover:text-primary transition-colors duration-300">Compress PDF</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">All Tools</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white tracking-wide">Company</h4>
                        <ul className="space-y-3 text-slate-400 font-medium">
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">About Us</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Blog</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Contact</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Partners</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white tracking-wide">Support</h4>
                        <ul className="space-y-3 text-slate-400 font-medium">
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Help Center</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Terms of Service</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Cookie Policy</Link></li>
                            <li><Link to="/" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-medium">
                    <p>&copy; {new Date().getFullYear()} PDFHub. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/" className="hover:text-white transition-colors duration-300">Privacy</Link>
                        <Link to="/" className="hover:text-white transition-colors duration-300">Terms</Link>
                        <Link to="/" className="hover:text-white transition-colors duration-300">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
