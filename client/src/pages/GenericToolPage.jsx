import React, { useState } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import FileUpload from '../components/FileUpload';

const GenericToolPage = ({
    title,
    titleSpan,
    description,
    endpoint,
    accept = ".pdf",
    buttonText = "PROCESS",
    processingText = "PROCESSING...",
    successTitle = "Complete!",
    successMessage = "Your file has been processed successfully.",
    downloadText = "DOWNLOAD FILE",
    multiple = false,
    requirePassword = false
}) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState('');

    const handleProcess = async () => {
        if (files.length === 0) return;
        if (requirePassword && !password) {
            setError("Password is required for this operation.");
            return;
        }

        setLoading(true);
        setError(null);
        const formData = new FormData();

        if (multiple) {
            files.forEach(file => formData.append('files', file));
        } else {
            formData.append(files[0].name.endsWith('.pdf') ? 'pdf' : 'file', files[0]);
        }

        if (requirePassword) {
            formData.append('password', password);
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/pdf/${endpoint}`, formData);
            setDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during processing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 relative min-h-[calc(100vh-100px)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none opacity-50"></div>

            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 relative z-10">
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-[900] tracking-tight mb-4 md:mb-6 leading-tight uppercase break-words px-4">
                    {title} <span className="hero-gradient">{titleSpan}</span>
                </h1>
                <p className="text-base md:text-xl text-[#64748B] font-medium leading-relaxed px-4">
                    {description}
                </p>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {!downloadUrl ? (
                    <div className="glass rounded-[2rem] p-6 md:p-12 shadow-2xl border-white/50 space-y-8 md:space-y-10">
                        <FileUpload files={files} setFiles={setFiles} multiple={multiple} accept={accept} />

                        {requirePassword && files.length > 0 && (
                            <div className="max-w-md mx-auto">
                                <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">
                                    {endpoint === 'protect' ? 'Set Password' : 'Enter Password'}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Icons.Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                                        placeholder={endpoint === 'protect' ? 'Enter password to protect PDF' : 'Enter password to unlock PDF'}
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-3 font-semibold animate-shake">
                                <Icons.AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleProcess}
                                disabled={files.length === 0 || loading || (requirePassword && !password)}
                                className="btn-primary w-full md:w-80 h-16 text-xl shadow-xl shadow-primary/20 disabled:opacity-50 group hover:scale-105 transition-all duration-300"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Icons.Loader2 className="animate-spin" />
                                        <span>{processingText}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span>{buttonText}</span>
                                        <Icons.ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl text-center border-white/50 animate-fade-up">
                        <div className="relative w-32 h-32 mx-auto mb-10">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                            <div className="relative bg-green-500 text-white p-8 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center">
                                <Icons.Download size={56} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black mb-4 text-secondary">{successTitle}</h2>
                        <p className="text-[#64748B] text-lg font-medium mb-12 italic">"{successMessage}"</p>

                        <div className="space-y-4">
                            <a href={downloadUrl} download className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3">
                                <Icons.Download size={24} />
                                <span>{downloadText}</span>
                            </a>
                            <button
                                onClick={() => { setDownloadUrl(null); setFiles([]); setPassword(''); }}
                                className="w-full py-4 text-[#64748B] hover:text-primary font-bold transition-all transition-colors flex items-center justify-center gap-2"
                            >
                                <Icons.RefreshCw size={18} />
                                <span>PROCESS ANOTHER FILE</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenericToolPage;
