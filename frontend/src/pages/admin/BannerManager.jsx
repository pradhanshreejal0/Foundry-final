import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Trash2, Plus, Edit } from 'lucide-react';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', linkUrl: '/shop', buttonText: 'Shop Now', position: 0 });
  const [editingId, setEditingId] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await api('/theme/admin/banners');
      if (res?.data) setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api(`/theme/banners/${editingId}`, { method: 'PUT', body: form });
      } else {
        await api('/theme/banners', { method: 'POST', body: form });
      }
      setForm({ title: '', subtitle: '', imageUrl: '', linkUrl: '/shop', buttonText: 'Shop Now', position: 0 });
      setEditingId(null);
      fetchBanners();
    } catch (err) {
      alert(err.message || 'Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || '/shop',
      buttonText: banner.buttonText || 'Shop Now',
      position: banner.position || 0
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api(`/theme/banners/${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch (err) {
      alert(err.message || 'Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hero Banners Manager</h1>
        <p className="text-sm text-muted-foreground">Add and manage hero carousel slides displayed on the homepage.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Hero Banner' : 'Add New Hero Banner'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="NEW SEIKO AUTOMATIC" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Precision craftsmanship" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} required placeholder="https://images.unsplash.com/..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} placeholder="/shop" />
              </div>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} placeholder="Shop Now" />
              </div>
              <div className="space-y-2">
                <Label>Position Order</Label>
                <Input type="number" value={form.position} onChange={e => setForm({ ...form, position: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-black text-white hover:bg-neutral-800">
                {editingId ? 'Update Banner' : 'Create Banner'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ title: '', subtitle: '', imageUrl: '', linkUrl: '/shop', buttonText: 'Shop Now', position: 0 }); }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">Existing Banners ({banners.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(banner => (
            <div key={banner._id} className="border rounded-lg overflow-hidden bg-card shadow-sm flex flex-col justify-between">
              <div className="h-36 relative bg-muted">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5 rounded font-bold">
                  Pos: {banner.position}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm">{banner.title}</h3>
                <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
              </div>
              <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t mt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
                  <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(banner._id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
