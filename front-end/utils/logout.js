import AuthService from "@/services/AuthService";
import { signOut } from "next-auth/react";

const handleLogout = async (session) => {
  await Promise.all([
    AuthService.signOut({
      refreshToken: session?.user?.refreshToken,
    }),
    signOut({
      redirect: true,
      callbackUrl: "/",
    }),
  ]);
};
export default handleLogout;
