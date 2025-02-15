import { useEffect, useState, ComponentType } from "react";
import useSession from "@/hooks/useSession";
import { User } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  WrappedComponent: ComponentType<{ user: User }>;
}

const ProtectedRoute = ({ WrappedComponent }: ProtectedRouteProps) => {
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return null;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return <WrappedComponent user={user} />;
};

export default ProtectedRoute;