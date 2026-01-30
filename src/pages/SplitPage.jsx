import React, { useState } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import FileUpload from '../components/FileUpload';

const SplitPage = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [pageRange, setPageRange] = useState('');

    const handleProcess = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('pdf', files[0]);
        formData.append('pages', pageRange);

        try {
            const response = await axios.post('/api/pdf/split', formData);
            setDownloadUrl(`${response.data.downloadUrl}`);
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
                    Split <span className="hero-gradient">PDF</span>
                </h1>
                <p className="text-xl text-[#64748B] font-medium leading-relaxed">
                    Extract pages from your PDF with precision. Select specific pages or ranges to create a new document.
                </p>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {!downloadUrl ? (
                    <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-white/50 space-y-10">
                        <FileUpload files={files} setFiles={setFiles} multiple={false} />

                        {files.length > 0 && (
                            <div className="animate-fade-in">
                                <label className="block text-secondary font-bold mb-3 ml-2">Page Range (Optional)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Icons.Layers size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={pageRange}
                                        onChange={(e) => setPageRange(e.target.value)}
                                        placeholder="e.g. 1-5, 8, 11-13 (Leave empty to extract all)"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-secondary"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 ml-2 font-medium">
                                    *Format: Single pages (1, 5) or ranges (1-5). Example: 1, 3-5, 8
                                </p>
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
                                disabled={files.length === 0 || loading}
                                className="btn-primary w-full md:w-80 h-16 text-xl shadow-xl shadow-primary/20 disabled:opacity-50 group hover:scale-105 transition-all duration-300"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Icons.Loader2 className="animate-spin" />
                                        <span>PROCESSING...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span>SPLIT PDF NOW</span>
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
                        <h2 className="text-4xl font-black mb-4 text-secondary">Ready to Download!</h2>
                        <p className="text-[#64748B] text-lg font-medium mb-12 italic">"Your PDF has been split successfully."</p>

                        <div className="space-y-4">
                            <a href={downloadUrl} download className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3">
                                <Icons.Download size={24} />
                                <span>DOWNLOAD YOUR PDF</span>
                            </a>
                            <button
                                onClick={() => { setDownloadUrl(null); setFiles([]); setPageRange(''); }}
                                className="w-full py-4 text-[#64748B] hover:text-primary font-bold transition-all transition-colors flex items-center justify-center gap-2"
                            >
                                <Icons.RefreshCw size={18} />
                                <span>SPLIT ANOTHER FILE</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SplitPage;
