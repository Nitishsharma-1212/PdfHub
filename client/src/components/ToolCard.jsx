import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const ToolCard = ({ tool }) => {
    const IconComponent = Icons[tool.icon] || Icons.File;

    return (
        <Link to={`/${tool.slug}`} className="group relative bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300 ease-out ring-1 ring-slate-100 group-hover:ring-primary/50">
                    <IconComponent size={32} strokeWidth={1.5} className="text-slate-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <Icons.ArrowRight size={20} className="text-primary" />
                </div>
            </div>

            <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-200">
                {tool.name}
            </h3>

            <p className="relative z-10 text-slate-600 text-sm leading-relaxed mb-4 flex-grow font-medium">
                {tool.description}
            </p>
        </Link>
    );
};

export default ToolCard;
