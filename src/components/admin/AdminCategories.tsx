import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", sort_order: 0 });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("menu_categories").select("*").order("sort_order");
      return data || [];
    },
  });

  const resetForm = () => { setForm({ name: "", sort_order: 0 }); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const { error } = await supabase.from("menu_categories").update(form).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Category updated");
    } else {
      const { error } = await supabase.from("menu_categories").insert(form);
      if (error) { toast.error("Failed to add"); return; }
      toast.success("Category added");
    }
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("menu_categories").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Category deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Categories</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-xs py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-semibold">{editing ? "Edit Category" : "New Category"}</h3>
            <button type="button" onClick={resetForm}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
          </div>
          <div className="flex gap-4">
            <input placeholder="Category Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field flex-1" />
            <input type="number" placeholder="Sort" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="input-field w-24" />
          </div>
          <button type="submit" className="btn-primary text-xs py-2 px-6">{editing ? "Update" : "Add"}</button>
        </form>
      )}

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div>
              <span className="font-display font-semibold text-foreground">{cat.name}</span>
              <span className="text-muted-foreground font-body text-xs ml-2">#{cat.sort_order}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setForm({ name: cat.name, sort_order: cat.sort_order }); setEditing(cat); setShowForm(true); }} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-destructive hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
