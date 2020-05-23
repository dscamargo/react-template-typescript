import React, { useState, createContext, useContext, useCallback } from 'react';

import api from '../services/api';

export const UserStorage = '@App:user';
export const TokenStorage = '@App:token';

interface AuthContextInterface {
  user: object;
  signIn({ email, password }: SignInInterface): Promise<void>;
  signOut(): void;
}

interface SignInInterface {
  email: string;
  password: string;
}

interface AuthState {
  token: string;
  user: object;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const user = localStorage.getItem(UserStorage);
    const token = localStorage.getItem(TokenStorage);

    if (user && token) {
      return {
        token,
        user: JSON.parse(user),
      };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInInterface) => {
    const response = await api.post('/sessions', { email, password });

    const { token, user } = response.data;

    localStorage.setItem(TokenStorage, token);
    localStorage.setItem(UserStorage, JSON.stringify(user));
    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(UserStorage);
    localStorage.removeItem(TokenStorage);
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextInterface {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
