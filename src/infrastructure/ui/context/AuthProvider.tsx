import { useEffect, useState } from "react";
import { supabaseClient } from "../../../di.ts"; 
import { AuthContext } from "./AuthContext.ts";
import type { User } from "../../../core/domain/User.ts"; 
import type { User as SupabaseUser } from "@supabase/supabase-js"; 


const mapSupabaseUserToDomain = (supaUser: SupabaseUser): User => {
    return {
        id: supaUser.id,
        email: supaUser.email || "", 
    };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Verificación inicial (Persistencia)
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                
                if (session?.user) {
                    const domainUser = mapSupabaseUserToDomain(session.user);
                    setUser(domainUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Session check failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        // 2. Escuchar cambios en tiempo real
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const domainUser = mapSupabaseUserToDomain(session.user);
                setUser(domainUser);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

  if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-900/20">
                    </div>
                </div>
            </div>
        );
    }
    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}