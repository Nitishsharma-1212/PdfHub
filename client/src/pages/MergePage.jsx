import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import * as Icons from 'lucide-react';

const MergePage = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);

    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please select at least 2 PDF files to merge.");
            return;
        }

        setLoading(true);
        setError(null);
        const formData = new FormData();
        files.forEach(file => formData.append('pdfs', file));

        try {
            const response = await axios.post('http://localhost:5000/api/pdf/merge', formData);
            setDownloadUrl(`http://localhost:5000${response.data.downloadUrl}`);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during processing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-20 relative min-h-[80vh]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
                <h1 className="text-5xl md:text-6xl font-[900] tracking-tight mb-6 leading-tight uppercase">
                    Merge <span className="hero-gradient">PDF</span>
                </h1>
                <p className="text-xl text-[#64748B] font-medium leading-relaxed">
                    Combine PDFs in the order you want with the easiest and fastest PDF merger available online.
                </p>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {!downloadUrl ? (
                    <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-white/50 space-y-10">
                        <FileUpload files={files} setFiles={setFiles} />

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-3 font-semibold animate-shake">
                                <Icons.AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleMerge}
                                disabled={files.length < 2 || loading}
                                className="btn-primary w-full md:w-80 h-16 text-xl shadow-xl shadow-primary/20 disabled:opacity-50 group hover:scale-105 transition-all duration-300"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Icons.Loader2 className="animate-spin" />
                                        <span>MERGING...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span>MERGE PDFs</span>
                                        <Icons.ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto glass p-12 rounded-[3rem] shadow-2xl text-center border-white/50 animate-fade-up">
                        <div className="relative w-32 h-32 mx-auto mb-10">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                            <div className="relative bg-green-500 text-white p-8 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center">
                                <Icons.Download size={56} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black mb-4 text-secondary">Success!</h2>
                        <p className="text-[#64748B] text-lg font-medium mb-12 italic">"Your PDFs have been combined into one masterpiece."</p>

                        <div className="space-y-4">
                            <a href={downloadUrl} download className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3">
                                <Icons.Download size={24} />
                                <span>DOWNLOAD MERGED PDF</span>
                            </a>
                            <button
                                onClick={() => { setDownloadUrl(null); setFiles([]); }}
                                className="w-full py-4 text-[#64748B] hover:text-primary font-bold transition-all transition-colors flex items-center justify-center gap-2"
                            >
                                <Icons.RefreshCw size={18} />
                                <span>MERGE MORE FILES</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MergePage;
