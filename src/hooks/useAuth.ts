import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Email/password login
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // we handle navigation manually
      });
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    try {
      const res = await signIn("google", { redirect: false, callbackUrl: "/dashboard" });
      console.log("Google login result:", res); // now you'll see this
      if (res?.url) {
        // manually redirect after successful login
        window.location.href = res.url;
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };
  
  
  // Logout
  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Protect routes
  const requireAuth = (callback?: () => void) => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return false;
    }
    if (callback) callback();
    return true;
  };

  return {
    session,
    status,
    login,
    loginWithGoogle,
    logout,
    requireAuth,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
