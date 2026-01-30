import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MergePage from './pages/MergePage';
import SplitPage from './pages/SplitPage';
import CompressPage from './pages/CompressPage';
import ImageToPdfPage from './pages/ImageToPdfPage';
import GenericToolPage from './pages/GenericToolPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Routes>
                    {/* Admin Routes (No Navbar) */}
                    <Route path="/admin/login" element={<LoginPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />

                    {/* Public Routes with Navbar */}
                    <Route
                        path="/*"
                        element={
                            <>
                                <Navbar />
                                <main className="flex-1">
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/merge-pdf" element={<MergePage />} />
                                        <Route path="/split-pdf" element={<SplitPage />} />
                                        <Route path="/compress-pdf" element={<CompressPage />} />
                                        <Route path="/img-to-pdf" element={<ImageToPdfPage />} />

                                        {/* New Tools */}
                                        <Route path="/pdf-to-word" element={
                                            <GenericToolPage
                                                title="PDF to" titleSpan="Word"
                                                description="Convert your PDF to WORD documents with incredible accuracy."
                                                endpoint="pdf-to-word" buttonText="CONVERT TO WORD"
                                            />
                                        } />
                                        <Route path="/pdf-to-ppt" element={
                                            <GenericToolPage
                                                title="PDF to" titleSpan="PowerPoint"
                                                description="Turn your PDF files into easy to edit PPT and PPTX slideshows."
                                                endpoint="pdf-to-ppt" buttonText="CONVERT TO PPT"
                                            />
                                        } />
                                        <Route path="/pdf-to-excel" element={
                                            <GenericToolPage
                                                title="PDF to" titleSpan="Excel"
                                                description="Pull data straight from PDFs into Excel spreadsheets in a few short seconds."
                                                endpoint="pdf-to-excel" buttonText="CONVERT TO EXCEL"
                                            />
                                        } />
                                        <Route path="/excel-to-pdf" element={
                                            <GenericToolPage
                                                title="Excel to" titleSpan="PDF"
                                                description="Convert Excel spreadsheets to PDF."
                                                endpoint="excel-to-pdf" accept=".xlsx,.xls" buttonText="CONVERT TO PDF"
                                            />
                                        } />
                                        <Route path="/edit-pdf" element={
                                            <GenericToolPage
                                                title="Edit" titleSpan="PDF"
                                                description="Add text, shapes, images and freehand annotations to your PDF."
                                                endpoint="edit-pdf" buttonText="EDIT PDF"
                                            />
                                        } />
                                        <Route path="/pdf-to-jpg" element={
                                            <GenericToolPage
                                                title="PDF to" titleSpan="JPG"
                                                description="Convert each PDF page into a JPG or extract all images contained in a PDF."
                                                endpoint="pdf-to-jpg" buttonText="CONVERT TO JPG"
                                            />
                                        } />
                                        <Route path="/unlock-pdf" element={
                                            <GenericToolPage
                                                title="Unlock" titleSpan="PDF"
                                                description="Remove PDF password security, giving you the freedom to use your data as you want."
                                                endpoint="unlock" buttonText="UNLOCK PDF" requirePassword={true}
                                            />
                                        } />
                                        <Route path="/protect-pdf" element={
                                            <GenericToolPage
                                                title="Protect" titleSpan="PDF"
                                                description="Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access."
                                                endpoint="protect" buttonText="PROTECT PDF" requirePassword={true}
                                            />
                                        } />
                                    </Routes>
                                </main>
                                <Footer />
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
