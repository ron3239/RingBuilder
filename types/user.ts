// Основные типы пользователя
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

// Типы для аутентификации
export interface LoginRequest {
  username: string; // Изменено с email на username
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Типы для сессии
export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userAgent?: string;
  ipAddress?: string;
  deviceName?: string;
  expiresAt: string;
  createdAt: string;
}

// Типы ошибок API
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Валидация
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email обязателен';
  if (!emailRegex.test(email)) return 'Неверный формат email';
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) return 'Имя пользователя обязательно';
  if (username.length < 3) return 'Минимум 3 символа';
  if (username.length > 50) return 'Максимум 50 символов';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Пароль обязателен';
  if (password.length < 6) return 'Минимум 6 символов';
  return null;
};

export const validateName = (name: string | undefined, fieldName: string): string | null => {
  if (name && name.length > 100) return `${fieldName} максимум 100 символов`;
  return null;
};
