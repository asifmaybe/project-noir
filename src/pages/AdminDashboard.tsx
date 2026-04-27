import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, UtensilsCrossed, Star, Gift, ShoppingBag, CalendarDays, Settings, FolderOpen } from "lucide-react";
import AdminMenuItems from "@/components/admin/AdminMenuItems";
import AdminSpecials from "@/components/admin/AdminSpecials";
import AdminOffers from "@/components/admin/AdminOffers";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminReservations from "@/components/admin/AdminReservations";
import AdminCategories from "@/components/admin/AdminCategories";

const tabs = [
  { id: "menu", label: "Menu Items", icon: UtensilsCrossed },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "specials", label: "Specials", icon: Star },
  { id: "offers", label: "Offers", icon: Gift },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "reservations", label: "Reservations", icon: CalendarDays },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("menu");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin/login"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      if (!roles || roles.length === 0) { navigate("/admin/login"); toast.error("No admin access"); return; }
      setLoading(false);
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-primary font-display text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <a href="/" className="font-display text-xl font-bold text-gradient-gold">NOIR</a>
          <span className="text-muted-foreground font-body text-xs uppercase tracking-widest">Admin</span>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-border min-h-[calc(100vh-65px)] bg-card/50 hidden md:block">
          <div className="p-4 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all ${
                  activeTab === id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 min-w-[60px] flex flex-col items-center gap-1 py-3 px-2 text-xs transition-colors ${
                activeTab === id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
          {activeTab === "menu" && <AdminMenuItems />}
          {activeTab === "categories" && <AdminCategories />}
          {activeTab === "specials" && <AdminSpecials />}
          {activeTab === "offers" && <AdminOffers />}
          {activeTab === "orders" && <AdminOrders />}
          {activeTab === "reservations" && <AdminReservations />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
