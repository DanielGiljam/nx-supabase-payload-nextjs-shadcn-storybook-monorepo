"use client";

import type {Session} from "@supabase/supabase-js";
import React from "react";

import {SupabaseAuthContext} from "./SupabaseAuthContext";
import {createClient} from "./client";

export const SupabaseAuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [loading, setLoading] = React.useState(true);
    const [session, setSession] = React.useState<Session | null>(null);
    React.useEffect(() => {
        const supabase = createClient();
        let hasFiredOnce = false;
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Supabase Auth state change", event, session);
            setLoading(false);
            setSession(session);
            if (!hasFiredOnce && session == null) {
                // this ensures other browser tabs/windows are informed about server-side sign out
                supabase.auth
                    .signOut({scope: "local"})
                    .then(({error}) => {
                        if (error != null) {
                            throw error;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            hasFiredOnce = true;
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    return (
        <SupabaseAuthContext.Provider value={{loading, session}}>
            {children}
        </SupabaseAuthContext.Provider>
    );
};
