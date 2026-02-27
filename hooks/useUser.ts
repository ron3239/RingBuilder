import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';
import { api, saveTokens, clearTokens } from '../services/api';

const USER_KEY = '@user_data';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (userData: User, accessToken: string, refreshToken: string) => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      await saveTokens(accessToken, refreshToken);
      setUser(userData);
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      await AsyncStorage.removeItem(USER_KEY);
      await clearTokens();
      setUser(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
      // Даже если запрос не прошел, очищаем локальные данные
      await AsyncStorage.removeItem(USER_KEY);
      await clearTokens();
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const freshUser = await api.getProfile();
      setUser(freshUser);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(freshUser));
    } catch (error) {
      console.error('Не удалось обновить профиль:', error);
      throw error;
    }
  };

  return { user, loading, saveUser, logout, refreshUser: loadUser, refreshProfile };
}
