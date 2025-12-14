'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Upload, Loader2 } from 'lucide-react';

interface SiteSettings {
    whatsappNumber: string;
    phone: string;
    email: string;
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    carouselImages: string[];
}

const DEFAULT_SETTINGS: SiteSettings = {
    whatsappNumber: '03310076524',
    phone: '',
    email: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    carouselImages: []
};

export default function SettingsManager() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'site_settings', 'config');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as SiteSettings);
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (field: keyof SiteSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_settings', 'config'), settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];
        console.log("File selected:", file.name, file.type, file.size);

        setUploading(true);
        setUploadError(null);

        try {
            // Create form data for API
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'carousel');

            console.log("Uploading to Cloudinary via API...");

            // Call our API route
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log("Upload response:", data);

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            const url = data.url;
            console.log("Image URL:", url);

            // Update local state
            const newImages = [...(settings.carouselImages || []), url];
            const updatedSettings = { ...settings, carouselImages: newImages };

            // Save to Firestore
            await setDoc(doc(db, 'site_settings', 'config'), updatedSettings);
            setSettings(updatedSettings);

            alert("Image uploaded successfully!");

        } catch (error: any) {
            console.error("Upload error:", error);
            setUploadError(error.message || "Upload failed");
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = async (indexToRemove: number) => {
        const newImages = settings.carouselImages.filter((_, index) => index !== indexToRemove);
        const updatedSettings = { ...settings, carouselImages: newImages };

        try {
            await setDoc(doc(db, 'site_settings', 'config'), updatedSettings);
            setSettings(updatedSettings);
        } catch (error) {
            console.error("Error removing image:", error);
            alert("Failed to remove image");
        }
    };

    if (loading) return <div className="text-white">Loading settings...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Contact & Social Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-white">WhatsApp Number (for Orders)</Label>
                            <Input
                                id="whatsapp"
                                value={settings.whatsappNumber}
                                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                                placeholder="e.g. 923310076524"
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                            <p className="text-xs text-slate-400">Format: Country code without +, e.g. 92331...</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-white">Phone Number (Footer)</Label>
                                <Input
                                    id="phone"
                                    value={settings.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email (Footer)</Label>
                                <Input
                                    id="email"
                                    value={settings.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="facebook" className="text-white">Facebook URL</Label>
                            <Input
                                id="facebook"
                                value={settings.facebookUrl}
                                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram" className="text-white">Instagram URL</Label>
                            <Input
                                id="instagram"
                                value={settings.instagramUrl}
                                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter" className="text-white">Twitter URL</Label>
                            <Input
                                id="twitter"
                                value={settings.twitterUrl}
                                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                                className="bg-slate-800 border-slate-600 text-white"
                            />
                        </div>

                        <Button onClick={handleSave} disabled={saving} className="w-full">
                            {saving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Hero Carousel Images</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {/* Upload button */}
                        <Button
                            onClick={triggerFileInput}
                            disabled={uploading}
                            variant="secondary"
                            className="w-full h-24 border-2 border-dashed border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:border-primary"
                        >
                            {uploading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Uploading to Cloudinary...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-6 w-6" />
                                    <span>Click to Upload Image</span>
                                </div>
                            )}
                        </Button>

                        {uploadError && (
                            <p className="text-red-500 text-sm">{uploadError}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {settings.carouselImages?.map((url, index) => (
                                <div key={index} className="relative group aspect-video rounded-md overflow-hidden border border-slate-700">
                                    <img src={url} alt={`Carousel ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {(!settings.carouselImages || settings.carouselImages.length === 0) && (
                                <p className="flex items-center justify-center col-span-2 h-24 text-slate-500 text-sm italic">
                                    No images uploaded. Default placeholders will be used.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
