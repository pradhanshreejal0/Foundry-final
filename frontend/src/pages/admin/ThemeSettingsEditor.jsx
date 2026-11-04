import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';

export default function ThemeSettingsEditor() {
  const [settings, setSettings] = useState({
    announcementText: '',
    countdownTarget: '',
    announcementEnabled: true,
    storeName: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    api('/theme/settings')
      .then(res => {
        if (res?.data) {
          // Format date for datetime-local input if present
          const data = res.data;
          if (data.countdownTarget) {
            data.countdownTarget = new Date(data.countdownTarget).toISOString().slice(0, 16);
          }
          setSettings(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      await api('/theme/settings', {
        method: 'PUT',
        body: settings
      });
      setSuccessMsg('Theme settings updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update theme settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seiko Theme & Announcement Settings</h1>
        <p className="text-sm text-muted-foreground">Manage store-wide announcements, countdown timers, and branding.</p>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded text-sm font-medium">
          {successMsg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Announcement Bar & Countdown Timer</CardTitle>
          <CardDescription>Configure promotional top banner and limited-time offer timer.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="announcementEnabled"
                checked={settings.announcementEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, announcementEnabled: checked })}
              />
              <Label htmlFor="announcementEnabled">Enable Announcement Bar</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcementText">Announcement Text</Label>
              <Input
                id="announcementText"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                placeholder="FREE SHIPPING ON ORDERS OVER $50 • USE CODE SEIKO20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="countdownTarget">Countdown Timer Expiry Target</Label>
              <Input
                id="countdownTarget"
                type="datetime-local"
                value={settings.countdownTarget}
                onChange={(e) => setSettings({ ...settings, countdownTarget: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeName">Store Branding Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-black text-white hover:bg-neutral-800">
              {saving ? 'Saving...' : 'Save Theme Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
