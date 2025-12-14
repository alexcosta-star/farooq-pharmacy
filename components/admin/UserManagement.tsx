'use client';

import { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserManagement() {
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (!user) return;

        setLoading(true);
        try {
            await updatePassword(user, newPassword);
            alert("Password updated successfully");
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error("Error updating password:", error);
            alert("Failed to update password. You may need to re-login recently to perform this action.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-md">
            <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Admin Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-white">Email</Label>
                        <Input
                            value={user?.email || ''}
                            disabled
                            className="bg-slate-800 border-slate-600 text-slate-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-pass" className="text-white">New Password</Label>
                        <Input
                            id="new-pass"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-slate-800 border-slate-600 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-pass" className="text-white">Confirm Password</Label>
                        <Input
                            id="confirm-pass"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-slate-800 border-slate-600 text-white"
                        />
                    </div>

                    <Button onClick={handleUpdatePassword} disabled={loading} className="w-full">
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
