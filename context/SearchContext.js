"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user once globally
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserInfo(user);
    };
    getUser();
  }, []);

  return (
    <SearchContext.Provider value={{ search, setSearch, userInfo, setUserInfo }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);