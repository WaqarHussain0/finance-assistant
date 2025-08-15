import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PAGE_LINK } from "../../constant/page-link.constant";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const logout = async () => {
    await signOut({ redirect: false });
    router.push(PAGE_LINK.signin);
  };

  return {
    session,
    user: session?.user,
    isAuthenticated,
    isLoading,
    logout,
  };
}
