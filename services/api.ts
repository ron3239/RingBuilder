import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/user'
import { BaseTemplate, RingDesign, SavedRingDesign } from '../types/ring-design'

// Для Android эмулятора используй 10.0.2.2
// Для реального устройства используй IP адрес компьютера
const API_URL = __DEV__
	? 'http://192.168.1.161:3000' // Твой локальный IP (без /api)
	: 'https://your-production-api.com' // Production

const TOKEN_KEY = '@access_token'
const REFRESH_TOKEN_KEY = '@refresh_token'

// Получение токена
export const getAccessToken = async (): Promise<string | null> => {
	return await AsyncStorage.getItem(TOKEN_KEY)
}

// Получение refresh токена
export const getRefreshToken = async (): Promise<string | null> => {
	return await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
}

// Сохранение токенов
export const saveTokens = async (accessToken: string, refreshToken: string) => {
	await AsyncStorage.setItem(TOKEN_KEY, accessToken)
	await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

// Удаление токенов
export const clearTokens = async () => {
	await AsyncStorage.removeItem(TOKEN_KEY)
	await AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
}

// API запросы
export const api = {
	// Регистрация
	register: async (data: RegisterRequest): Promise<AuthResponse> => {
		console.log('Registering user:', { email: data.email, username: data.username })
		console.log('API URL:', `${API_URL}/auth/register`)

		const response = await fetch(`${API_URL}/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})

		console.log('Register response status:', response.status)

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Ошибка регистрации')
		}

		return response.json()
	},

	// Вход
	login: async (data: LoginRequest): Promise<AuthResponse> => {
		console.log('Logging in user:', data.username)
		console.log('API URL:', `${API_URL}/auth/login`)

		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})

		console.log('Login response status:', response.status)

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.message || 'Ошибка входа')
		}

		return response.json()
	},

	// Получение профиля
	getProfile: async (): Promise<User> => {
		const token = await getAccessToken()

		const response = await fetch(`${API_URL}/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error('Ошибка получения профиля')
		}

		return response.json()
	},

	// Выход
	logout: async (): Promise<void> => {
		const token = await getAccessToken()

		await fetch(`${API_URL}/auth/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		await clearTokens()
	},

	// Обновление токена
	refreshToken: async (): Promise<AuthResponse> => {
		const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)

		const response = await fetch(`${API_URL}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken }),
		})

		if (!response.ok) {
			throw new Error('Ошибка обновления токена')
		}

		return response.json()
	},
}

// API Request/Response Types for Ring Design
interface CreateRingDesignRequest {
	templateId: string
	metal: {
		fineness: number
		color: string
	}
	gemstone?: {
		type: string
		size: string
	} | null
	name?: string
}

interface CreateRingDesignResponse {
	id: string
	userId: string
	templateId: string
	metal: {
		fineness: number
		color: string
	}
	gemstone: {
		type: string
		size: string
	} | null
	name: string | null
	createdAt: string
	updatedAt: string
}

interface GetRingDesignsResponse {
	designs: SavedRingDesign[]
	total: number
}

interface GetTemplatesResponse {
	templates: BaseTemplate[]
}

// Retry utility with exponential backoff
const retryWithBackoff = async <T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	baseDelay: number = 1000
): Promise<T> => {
	let lastError: Error

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn()
		} catch (error) {
			lastError = error as Error

			// Don't retry on client errors (4xx)
			if (error instanceof Response && error.status >= 400 && error.status < 500) {
				throw error
			}

			// Wait before retry with exponential backoff
			if (attempt < maxRetries - 1) {
				const delay = baseDelay * Math.pow(2, attempt)
				await new Promise(resolve => setTimeout(resolve, delay))
			}
		}
	}

	throw lastError!
}

// Ring Design API methods
export const ringDesignApi = {
	/**
	 * Get all available ring templates
	 * Validates: Requirements 6.2
	 */
	getTemplates: async (): Promise<BaseTemplate[]> => {
		return retryWithBackoff(async () => {
			const response = await fetch(`${API_URL}/templates`)

			if (!response.ok) {
				throw new Error('Failed to fetch templates')
			}

			const data: GetTemplatesResponse = await response.json()
			return data.templates
		})
	},

	/**
	 * Create a new ring design
	 * Validates: Requirements 6.2, 6.6
	 */
	createDesign: async (design: RingDesign, name?: string): Promise<SavedRingDesign> => {
		if (!design.template || !design.metal) {
			throw new Error('Template and metal configuration are required')
		}

		return retryWithBackoff(async () => {
			const token = await getAccessToken()

			if (!token) {
				throw new Error('Authentication required')
			}

			const requestBody: CreateRingDesignRequest = {
				templateId: design.template!.id,
				metal: {
					fineness: design.metal!.fineness,
					color: design.metal!.color,
				},
				gemstone: design.gemstone
					? {
							type: design.gemstone.type,
							size: design.gemstone.size,
						}
					: null,
				name,
			}

			const response = await fetch(`${API_URL}/ring-designs`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(requestBody),
			})

			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: 'Failed to create design' }))
				throw new Error(error.message || 'Failed to create design')
			}

			const responseData: CreateRingDesignResponse = await response.json()

			// Transform response to SavedRingDesign format
			return {
				id: responseData.id,
				userId: responseData.userId,
				design: {
					template: design.template,
					metal: design.metal,
					gemstone: design.gemstone,
				},
				createdAt: responseData.createdAt,
				updatedAt: responseData.updatedAt,
				name: responseData.name || undefined,
			}
		})
	},

	/**
	 * Get all designs for the current user
	 * Validates: Requirements 6.6, 7.2
	 */
	getDesigns: async (): Promise<SavedRingDesign[]> => {
		return retryWithBackoff(async () => {
			const token = await getAccessToken()

			if (!token) {
				throw new Error('Authentication required')
			}

			const response = await fetch(`${API_URL}/ring-designs`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				throw new Error('Failed to fetch designs')
			}

			const data: GetRingDesignsResponse = await response.json()
			return data.designs
		})
	},

	/**
	 * Get a specific design by ID
	 * Validates: Requirements 6.6, 7.2
	 */
	getDesign: async (id: string): Promise<SavedRingDesign> => {
		return retryWithBackoff(async () => {
			const token = await getAccessToken()

			if (!token) {
				throw new Error('Authentication required')
			}

			const response = await fetch(`${API_URL}/ring-designs/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Design not found')
				}
				throw new Error('Failed to fetch design')
			}

			return response.json()
		})
	},

	/**
	 * Delete a design by ID
	 * Validates: Requirements 6.6, 7.2
	 */
	deleteDesign: async (id: string): Promise<void> => {
		return retryWithBackoff(async () => {
			const token = await getAccessToken()

			if (!token) {
				throw new Error('Authentication required')
			}

			const response = await fetch(`${API_URL}/ring-designs/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error('Design not found')
				}
				throw new Error('Failed to delete design')
			}
		})
	},
}
