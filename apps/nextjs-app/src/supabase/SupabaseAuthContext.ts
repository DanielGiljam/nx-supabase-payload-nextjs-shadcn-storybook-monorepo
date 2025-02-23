/* eslint-disable unicorn/filename-case */
"use client";

import type {Session} from "@supabase/supabase-js";
import React from "react";

interface SupabaseAuthContextType {
    loading: boolean;
    session: Session | null;
}

const initialContext: SupabaseAuthContextType = {
    loading: true,
    session: null,
};

export const SupabaseAuthContext =
    React.createContext<SupabaseAuthContextType>(initialContext);
