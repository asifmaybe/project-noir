import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 border-yellow-400/30",
  confirmed: "text-blue-400 border-blue-400/30",
  preparing: "text-orange-400 border-orange-400/30",
  ready: "text-green-400 border-green-400/30",
  completed: "text-muted-foreground border-border",
  cancelled: "text-destructive border-destructive/30",
};

const AdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Order ${status}`);
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground font-body text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{order.customer_name}</h3>
                  <p className="text-muted-foreground font-body text-xs">{order.customer_email} {order.customer_phone && `• ${order.customer_phone}`}</p>
                  <p className="text-muted-foreground/50 font-body text-xs mt-1">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl font-bold text-primary">${order.total}</span>
                  <div className={`mt-1 inline-block px-3 py-1 rounded-full border text-xs uppercase tracking-wider ${statusColors[order.status] || ""}`}>
                    {order.status}
                  </div>
                </div>
              </div>
              {order.notes && <p className="text-muted-foreground font-body text-sm mb-3 italic">"{order.notes}"</p>}
              <div className="flex flex-wrap gap-2">
                {["confirmed", "preparing", "ready", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id, s)}
                    disabled={order.status === s}
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

export default AdminOrders;
