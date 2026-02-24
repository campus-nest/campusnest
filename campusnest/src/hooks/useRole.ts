import { authService } from "@/src/services";
import { Role } from "@/src/types/role";
import { useEffect, useState } from "react";

interface UseRoleResult {
    role: Role | null;
    loading: boolean;
}

/**
 * Fetches the current user's role once on mount.
 * Sets the default filter to "new" (student) or "recent" (landlord).
 * Cancels async updates if the component unmounts.
 */
export function useRole(): UseRoleResult {
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchRole = async () => {
            try {
                const userRole = await authService.getUserRole();
                if (cancelled) return;
                setRole(userRole);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRole();

        return () => {
            cancelled = true;
        };
    }, []);

    return { role, loading };
}
