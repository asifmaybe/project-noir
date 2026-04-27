import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const AdminOffers = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", discount_text: "", valid_until: "", is_active: true, image_url: "" });

  const { data: offers = [] } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: async () => {
      const { data } = await supabase.from("offers").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const resetForm = () => { setForm({ title: "", description: "", discount_text: "", valid_until: "", is_active: true, image_url: "" }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, description: form.description || null, image_url: form.image_url || null, valid_until: form.valid_until || null };
    if (editing) {
      const { error } = await supabase.from("offers").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Offer updated");
    } else {
      const { error } = await supabase.from("offers").insert(payload);
      if (error) { toast.error("Failed to add"); return; }
      toast.success("Offer added");
    }
    queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer?")) return;
    await supabase.from("offers").delete().eq("id", id);
    toast.success("Offer deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Offers</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs py-2 px-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Offer</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-semibold">{editing ? "Edit Offer" : "New Offer"}</h3>
            <button type="button" onClick={resetForm}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            <input placeholder="Discount Text (e.g. 30% OFF)" required value={form.discount_text} onChange={(e) => setForm({ ...form, discount_text: e.target.value })} className="input-field" />
            <input type="datetime-local" placeholder="Valid Until" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="input-field" />
            <input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} />
          <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          <button type="submit" className="btn-primary text-xs py-2 px-6">{editing ? "Update" : "Add"}</button>
        </form>
      )}

      <div className="space-y-3">
        {offers.map((o) => (
          <div key={o.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex-1 min-w-0">
              <span className="font-display font-semibold text-foreground">{o.title}</span>
              <span className="text-primary font-body text-sm ml-2">{o.discount_text}</span>
              {!o.is_active && <span className="text-destructive font-body text-xs ml-2">(Inactive)</span>}
              <p className="text-muted-foreground font-body text-xs truncate">{o.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setForm({ title: o.title, description: o.description || "", discount_text: o.discount_text, valid_until: o.valid_until || "", is_active: o.is_active, image_url: o.image_url || "" }); setEditing(o); setShowForm(true); }} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(o.id)} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-destructive hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOffers;
