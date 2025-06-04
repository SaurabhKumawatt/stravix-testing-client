import { createContext, useEffect, useState } from "react";
import { getProfile } from "../services/authService"; // Secure cookie-based auth

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (err) {
      setUser(null); // Not logged in or error occurred
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
