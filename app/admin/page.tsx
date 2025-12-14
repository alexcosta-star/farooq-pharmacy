'use client';

import { useState } from 'react';
import ProductManager from "@/components/admin/ProductManager";
import SettingsManager from "@/components/admin/SettingsManager";
import UserManagement from "@/components/admin/UserManagement";
import { LogOut, Package, Settings, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabType = 'products' | 'settings' | 'security';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'products', label: 'Products', icon: <Package className="h-4 w-4 mr-2" /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings className="h-4 w-4 mr-2" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4 mr-2" /> },
];

export default function AdminDashboard() {
    const { signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('products');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <Button variant="secondary" onClick={signOut} className="text-black hover:bg-slate-700 hover:text-white">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>

            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            activeTab === tab.id
                                ? "bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg shadow-primary/25"
                                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'products' && <ProductManager />}
                {activeTab === 'settings' && <SettingsManager />}
                {activeTab === 'security' && <UserManagement />}
            </div>
        </div>
    );
}
