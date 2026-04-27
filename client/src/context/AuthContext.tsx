import { createContext, useEffect, useState, ReactNode } from "react";
import { User } from "../lib/types";

interface AuthContextType {
  currentUser: User | null;
  updateUser: (data: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  updateUser: () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const updateUser = (data: User | null) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
