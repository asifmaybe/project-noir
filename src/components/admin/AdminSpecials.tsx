import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const AdminSpecials = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", image_url: "", is_active: true, sort_order: 0 });

  const { data: specials = [] } = useQuery({
    queryKey: ["admin-specials"],
    queryFn: async () => {
      const { data } = await supabase.from("specials").select("*").order("sort_order");
      return data || [];
    },
  });

  const resetForm = () => { setForm({ title: "", description: "", price: "", image_url: "", is_active: true, sort_order: 0 }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, image_url: form.image_url || null, description: form.description || null };
    if (editing) {
      const { error } = await supabase.from("specials").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Special updated");
    } else {
      const { error } = await supabase.from("specials").insert(payload);
      if (error) { toast.error("Failed to add"); return; }
      toast.success("Special added");
    }
    queryClient.invalidateQueries({ queryKey: ["admin-specials"] });
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this special?")) return;
    await supabase.from("specials").delete().eq("id", id);
    toast.success("Special deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-specials"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Specials</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs py-2 px-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Special</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-semibold">{editing ? "Edit Special" : "New Special"}</h3>
            <button type="button" onClick={resetForm}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            <input placeholder="Price (e.g. $185 per person)" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
            <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="input-field" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} />
          <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          <button type="submit" className="btn-primary text-xs py-2 px-6">{editing ? "Update" : "Add"}</button>
        </form>
      )}

      <div className="space-y-3">
        {specials.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex-1 min-w-0">
              <span className="font-display font-semibold text-foreground">{s.title}</span>
              <span className="text-primary font-body text-sm ml-2">{s.price}</span>
              {!s.is_active && <span className="text-destructive font-body text-xs ml-2">(Inactive)</span>}
              <p className="text-muted-foreground font-body text-xs truncate">{s.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setForm({ title: s.title, description: s.description || "", price: s.price, image_url: s.image_url || "", is_active: s.is_active, sort_order: s.sort_order }); setEditing(s); setShowForm(true); }} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-destructive hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSpecials;
