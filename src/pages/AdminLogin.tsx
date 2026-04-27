import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check admin role
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user");

        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin");

        if (!roles || roles.length === 0) {
          await supabase.auth.signOut();
          toast.error("You don't have admin access.");
          return;
        }

        toast.success("Welcome back, Admin!");
        navigate("/admin");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-3xl font-bold text-gradient-gold">NOIR</a>
          <p className="text-muted-foreground font-body text-sm mt-2 uppercase tracking-widest">Admin Panel</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            {isSignUp ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-muted-foreground font-body text-sm mt-6">
            {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-muted-foreground font-body text-sm hover:text-primary transition-colors">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
