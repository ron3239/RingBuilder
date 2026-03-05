// hooks/useCart.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

// Типы для товара
export interface CartItem {
	id: string
	name: string
	price: number
	quantity: number
	image?: string
	selectedSize?: string
	selectedColor?: string
	maxQuantity?: number
}

export interface Product {
	id: string
	name: string
	price: number
	description?: string
	images?: string[]
	sizes?: string[]
	colors?: string[]
	inStock?: boolean
	maxQuantity?: number
	modelName?: string
}

const CART_STORAGE_KEY = '@cart_items'

export function useCart() {
	const [cart, setCart] = useState<CartItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Загрузка корзины при монтировании
	useEffect(() => {
		loadCart()
	}, [])

	// Сохранение корзины в AsyncStorage
	const saveCart = async (items: CartItem[]) => {
		try {
			await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
		} catch (err) {
			console.error('Ошибка сохранения корзины:', err)
			setError('Не удалось сохранить корзину')
		}
	}

	// Загрузка корзины из AsyncStorage
	const loadCart = async () => {
		try {
			setLoading(true)
			const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY)
			if (savedCart) {
				setCart(JSON.parse(savedCart))
			}
		} catch (err) {
			console.error('Ошибка загрузки корзины:', err)
			setError('Не удалось загрузить корзину')
		} finally {
			setLoading(false)
		}
	}

	// В функции addToCart добавьте:
	const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
		console.log('🛒 Добавление товара:', product.name)
		console.log('📦 Текущая корзина до:', cart)

		setCart(prevCart => {
			console.log('🔄 Предыдущее состояние:', prevCart)

			const existingItem = prevCart.find(
				item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
			)

			console.log('🔍 Существующий товар:', existingItem)

			let newCart: CartItem[]

			if (existingItem) {
				const newQuantity = existingItem.quantity + quantity
				console.log('📈 Увеличиваем количество до:', newQuantity)

				newCart = prevCart.map(item =>
					item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
						? { ...item, quantity: newQuantity }
						: item
				)
			} else {
				console.log('➕ Добавляем новый товар')
				const newItem: CartItem = {
					id: product.id,
					name: product.name,
					price: product.price,
					quantity,
					image: product.images?.[0],
					selectedSize,
					selectedColor,
					maxQuantity: product.maxQuantity,
				}
				newCart = [...prevCart, newItem]
			}

			console.log('✅ Новая корзина:', newCart)
			saveCart(newCart)
			return newCart
		})
	}

	// Удаление товара из корзины
	const removeFromCart = (itemId: string, selectedSize?: string, selectedColor?: string) => {
		setCart(prevCart => {
			const newCart = prevCart.filter(
				item => !(item.id === itemId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
			)
			saveCart(newCart)
			return newCart
		})
	}

	// Обновление количества товара
	const updateQuantity = (itemId: string, newQuantity: number, selectedSize?: string, selectedColor?: string) => {
		if (newQuantity < 1) return

		setCart(prevCart => {
			const item = prevCart.find(
				item => item.id === itemId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
			)

			// Проверка максимального количества
			if (item?.maxQuantity && newQuantity > item.maxQuantity) {
				Alert.alert('Ограничение количества', `Максимальное количество: ${item.maxQuantity} шт.`)
				return prevCart
			}

			const newCart = prevCart.map(item =>
				item.id === itemId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
					? { ...item, quantity: newQuantity }
					: item
			)
			saveCart(newCart)
			return newCart
		})
	}

	// Увеличение количества товара на 1
	const incrementQuantity = (itemId: string, selectedSize?: string, selectedColor?: string) => {
		const item = cart.find(
			item => item.id === itemId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
		)
		if (item) {
			updateQuantity(itemId, item.quantity + 1, selectedSize, selectedColor)
		}
	}

	// Уменьшение количества товара на 1
	const decrementQuantity = (itemId: string, selectedSize?: string, selectedColor?: string) => {
		const item = cart.find(
			item => item.id === itemId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
		)
		if (item && item.quantity > 1) {
			updateQuantity(itemId, item.quantity - 1, selectedSize, selectedColor)
		}
	}

	// Очистка корзины
	const clearCart = () => {
		Alert.alert('Очистка корзины', 'Вы уверены, что хотите очистить корзину?', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Очистить',
				style: 'destructive',
				onPress: () => {
					setCart([])
					saveCart([])
				},
			},
		])
	}

	// Подсчет общего количества товаров
	const getTotalItems = (): number => {
		return cart.reduce((total, item) => total + item.quantity, 0)
	}

	// Подсчет общей стоимости
	const getTotalPrice = (): number => {
		return cart.reduce((total, item) => total + item.price * item.quantity, 0)
	}

	// Проверка, есть ли товар в корзине
	const isInCart = (productId: string, selectedSize?: string, selectedColor?: string): boolean => {
		return cart.some(
			item => item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
		)
	}

	// Получение количества конкретного товара в корзине
	const getItemQuantity = (productId: string, selectedSize?: string, selectedColor?: string): number => {
		const item = cart.find(
			item => item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
		)
		return item?.quantity || 0
	}

	// Синхронизация с сервером (для будущего бэкенда)
	const syncWithServer = async (userId: string) => {
		try {
			// TODO: Отправить корзину на сервер
			// const response = await api.syncCart(userId, cart)
			console.log('Синхронизация корзины для пользователя:', userId)
		} catch (err) {
			console.error('Ошибка синхронизации корзины:', err)
			setError('Не удалось синхронизировать корзину')
		}
	}

	return {
		cart,
		loading,
		error,
		addToCart,
		removeFromCart,
		updateQuantity,
		incrementQuantity,
		decrementQuantity,
		clearCart,
		getTotalItems,
		getTotalPrice,
		isInCart,
		getItemQuantity,
		syncWithServer,
	}
}
