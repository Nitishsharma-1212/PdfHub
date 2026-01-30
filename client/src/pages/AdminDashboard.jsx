import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('tools');
    const [tools, setTools] = useState([]);
    const [settings, setSettings] = useState({});
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchData();
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [toolsRes, settingsRes, logsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/tools', { headers }),
                axios.get('http://localhost:5000/api/admin/settings', { headers }),
                axios.get('http://localhost:5000/api/admin/logs', { headers })
            ]);
            setTools(toolsRes.data);
            setSettings(settingsRes.data);
            setLogs(logsRes.data);
        } catch (err) {
            if (err.response?.status === 401) navigate('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const toggleTool = async (id, enabled) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/tools/${id}`, { enabled: !enabled }, { headers });
            setTools(tools.map(t => t._id === id ? { ...t, enabled: !enabled } : t));
        } catch (err) {
            console.error(err);
        }
    };

    const updateSettings = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/admin/settings', settings, { headers });
            alert('Settings updated successfully');
        } catch (err) {
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-4">
                <Icons.Loader2 size={48} className="text-primary animate-spin" />
                <p className="font-bold text-secondary tracking-widest uppercase">Loading Panel...</p>
            </div>
        </div>
    );

    const SidebarItem = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold group ${activeTab === id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-[#64748B] hover:bg-white hover:text-primary'}`}
        >
            <Icon size={20} className={`transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span>{label}</span>
            {activeTab === id && <Icons.ChevronRight size={16} className="ml-auto opacity-50" />}
        </button>
    );

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Sidebar */}
            <div className="w-80 glass border-r border-white/50 p-8 flex flex-col relative z-20 h-screen sticky top-0">
                <div className="mb-12 px-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <Icons.LayoutDashboard size={24} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight uppercase">Admin<span className="text-primary">Panel</span></h2>
                    </div>
                    <p className="text-xs font-bold text-[#64748B] tracking-widest uppercase pl-1">Control Center</p>
                </div>

                <div className="space-y-4 flex-1">
                    <SidebarItem id="tools" label="Tools Management" icon={Icons.Package} />
                    <SidebarItem id="settings" label="Global Settings" icon={Icons.Settings} />
                    <SidebarItem id="logs" label="Activity Logs" icon={Icons.ScrollText} />
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 text-red-500 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/10 font-bold mt-auto border border-transparent hover:border-red-100"
                >
                    <Icons.LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-12 relative z-10 overflow-y-auto h-screen">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black capitalize mb-2 text-secondary flex items-center gap-3">
                            {activeTab} <span className="text-primary/20">/</span> <span className="text-lg font-medium text-[#64748B] uppercase tracking-widest">Overview</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary">
                            <Icons.Bell size={18} />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 shadow-lg shadow-primary/30"></div>
                    </div>
                </header>

                <div className="animate-fade-in">
                    {activeTab === 'tools' && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {tools.map(tool => (
                                <div key={tool._id} className="glass p-8 rounded-[2rem] border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl ${tool.enabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} transition-colors`}>
                                                {tool.enabled ? <Icons.CheckCircle2 size={24} /> : <Icons.XCircle size={24} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-secondary">{tool.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-500 uppercase tracking-widest">{tool.slug}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleTool(tool._id, tool.enabled)}
                                            className={`w-12 h-7 rounded-full transition-all duration-300 relative ${tool.enabled ? 'bg-primary' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${tool.enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-medium text-[#64748B] pt-6 border-t border-gray-100">
                                        <span>Status</span>
                                        <span className={tool.enabled ? 'text-green-600' : 'text-red-600'}>{tool.enabled ? 'Active & Visible' : 'Hidden from Users'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <form onSubmit={updateSettings} className="glass p-10 rounded-[2.5rem] border-white/60 shadow-xl max-w-3xl">
                            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                                <div className="bg-blue-50 text-blue-500 p-4 rounded-2xl">
                                    <Icons.Sliders size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">General Configuration</h3>
                                    <p className="text-[#64748B]">Manage global application settings</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-3 uppercase tracking-wider">Site Name</label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-secondary bg-white/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-3 uppercase tracking-wider">Max File Size (Bytes)</label>
                                    <input
                                        type="number"
                                        value={settings.maxFileSize}
                                        onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-secondary bg-white/50"
                                    />
                                    <p className="text-xs text-gray-400 mt-2 font-medium">Default: 10485760 (10MB)</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 text-orange-500 p-2 rounded-lg">
                                            <Icons.AlertOctagon size={20} />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-secondary">Maintenance Mode</span>
                                            <span className="text-sm text-gray-500">Disable site access for users</span>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.maintenanceMode}
                                            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <button type="submit" className="btn-primary w-full py-4 text-lg shadow-xl shadow-primary/20">
                                    <Icons.Save size={20} />
                                    <span>Save Configuration</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'logs' && (
                        <div className="glass rounded-[2.5rem] border-white/60 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-gray-100 bg-white/40">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <Icons.Activity size={24} className="text-primary" />
                                    Recent Activity
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50 text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                        <tr>
                                            <th className="px-8 py-6">Tool Used</th>
                                            <th className="px-8 py-6">User IP</th>
                                            <th className="px-8 py-6">Timestamp</th>
                                            <th className="px-8 py-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium text-secondary">
                                        {logs.map((log, index) => (
                                            <tr key={log._id} className="border-b border-gray-100/50 hover:bg-white/60 transition-colors last:border-b-0">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                            <Icons.FileText size={14} />
                                                        </div>
                                                        {log.toolUsed}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 font-mono text-gray-500">{log.ip}</td>
                                                <td className="px-8 py-5 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                                <td className="px-8 py-5">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wide">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {logs.length === 0 && (
                                <div className="p-12 text-center text-gray-400">
                                    <Icons.Inbox size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No activity logs found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
