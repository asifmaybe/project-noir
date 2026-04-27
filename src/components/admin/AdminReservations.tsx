import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminReservations = () => {
  const queryClient = useQueryClient();

  const { data: reservations = [] } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const { data } = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Reservation ${status}`);
    queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Reservations</h2>
      {reservations.length === 0 ? (
        <p className="text-muted-foreground font-body text-sm">No reservations yet.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{r.name}</h3>
                  <p className="text-muted-foreground font-body text-xs">{r.email}</p>
                  <p className="text-muted-foreground font-body text-sm mt-1">{r.date} • {r.guests} guest{r.guests > 1 ? "s" : ""}</p>
                </div>
                <span className={`px-3 py-1 rounded-full border text-xs uppercase tracking-wider ${
                  r.status === "confirmed" ? "text-green-400 border-green-400/30" :
                  r.status === "cancelled" ? "text-destructive border-destructive/30" :
                  "text-yellow-400 border-yellow-400/30"
                }`}>
                  {r.status}
                </span>
              </div>
              {r.message && <p className="text-muted-foreground font-body text-sm mb-3 italic">"{r.message}"</p>}
              <div className="flex gap-2">
                {["confirmed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(r.id, s)}
                    disabled={r.status === s}
                    className="px-3 py-1.5 border border-border rounded text-xs font-body uppercase tracking-wider hover:border-primary hover:text-primary disabled:opacity-30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
