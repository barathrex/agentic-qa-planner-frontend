import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  developerName: string | null;
  token: string | null;
  login: (developerName: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  developerName: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [developerName, setDeveloperName] = useState<string | null>(localStorage.getItem('qa_developer'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('qa_token'));

  useEffect(() => {
    if (developerName && token) {
      localStorage.setItem('qa_developer', developerName);
      localStorage.setItem('qa_token', token);
    } else {
      localStorage.removeItem('qa_developer');
      localStorage.removeItem('qa_token');
    }
  }, [developerName, token]);

  const login = (devName: string, jwtToken: string) => {
    setDeveloperName(devName);
    setToken(jwtToken);
    localStorage.setItem('qa_developer', devName);
    localStorage.setItem('qa_token', jwtToken);
  };

  const logout = () => {
    setDeveloperName(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ developerName, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
