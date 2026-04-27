import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const AdminMenuItems = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["admin-menu-items"],
    queryFn: async () => {
      const { data } = await supabase.from("menu_items").select("*, menu_categories(name)").order("sort_order");
      return data || [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("menu_categories").select("*").order("sort_order");
      return data || [];
    },
  });

  const [form, setForm] = useState({ name: "", description: "", price: "", category_id: "", image_url: "", is_available: true, sort_order: 0 });

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", category_id: "", image_url: "", is_available: true, sort_order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category_id: item.category_id || "",
      image_url: item.image_url || "",
      is_available: item.is_available,
      sort_order: item.sort_order,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      category_id: form.category_id || null,
      image_url: form.image_url || null,
      is_available: form.is_available,
      sort_order: form.sort_order,
    };

    if (editing) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Item updated");
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) { toast.error("Failed to add"); return; }
      toast.success("Item added");
    }
    queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Item deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Menu Items</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-semibold">{editing ? "Edit Item" : "New Item"}</h3>
            <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            <input placeholder="Price" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
              <option value="">No Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-body text-sm">
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
              Available
            </label>
            <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="input-field w-32" />
          </div>
          <button type="submit" className="btn-primary text-xs py-2 px-6">{editing ? "Update" : "Add"}</button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-semibold text-foreground">{item.name}</span>
                <span className="text-primary font-body text-sm">${item.price}</span>
                {!item.is_available && <span className="text-destructive font-body text-xs">(Unavailable)</span>}
              </div>
              <p className="text-muted-foreground font-body text-xs truncate">{item.description}</p>
              <p className="text-muted-foreground/50 font-body text-xs">{(item as any).menu_categories?.name || "No category"}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-destructive hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenuItems;
