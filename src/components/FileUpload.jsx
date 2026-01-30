import React, { useRef, useState } from 'react';
import { Upload, File, X, Plus } from 'lucide-react';

const FileUpload = ({ files, setFiles, multiple = true, accept = ".pdf" }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (multiple) {
            setFiles([...files, ...selectedFiles]);
        } else {
            setFiles(selectedFiles);
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {files.length === 0 ? (
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="drag-drop-area h-64 sm:h-80 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="bg-white text-primary p-6 rounded-3xl shadow-xl shadow-primary/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <Upload size={56} strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-secondary mb-2">Select PDF files</p>
                            <p className="text-lg text-[#64748B] font-medium">or drop PDFs here to get started</p>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple={multiple}
                        accept={accept}
                    />
                </div>
            ) : (
                <div className="glass rounded-[2rem] p-6 lg:p-8 shadow-2xl border-white/50 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {files.map((file, index) => (
                            <div key={index} className="relative group glass rounded-3xl p-6 flex flex-col items-center gap-4 border-white/80 hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                    className="absolute -top-3 -right-3 bg-secondary text-white rounded-full p-2 shadow-lg hover:bg-primary transition-colors z-20"
                                >
                                    <X size={16} />
                                </button>
                                <div className="text-primary bg-primary/5 p-5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <File size={40} />
                                </div>
                                <div className="text-center w-full">
                                    <p className="text-sm font-bold truncate text-secondary mb-1">{file.name}</p>
                                    <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        ))}
                        {multiple && (
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-white transition-all duration-300 group"
                            >
                                <div className="bg-gray-50 text-gray-400 p-4 rounded-2xl group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                                    <Plus size={40} />
                                </div>
                                <span className="text-xs font-black tracking-widest text-[#64748B] group-hover:text-primary">ADD MORE</span>
                            </button>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple={multiple}
                        accept={accept}
                    />
                </div>
            )}
        </div>
    );
};

export default FileUpload;
