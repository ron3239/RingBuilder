// contexts/CartContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

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
	images?: string[]
	sizes?: string[]
	maxQuantity?: number
}

interface CartContextType {
	cart: CartItem[]
	addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void
	removeFromCart: (itemId: string, selectedSize?: string, selectedColor?: string) => void
	updateQuantity: (itemId: string, newQuantity: number, selectedSize?: string, selectedColor?: string) => void
	clearCart: () => void
	getTotalPrice: () => number
	getTotalItems: () => number
	isInCart: (productId: string, selectedSize?: string, selectedColor?: string) => boolean
	getItemQuantity: (productId: string, selectedSize?: string, selectedColor?: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const CART_STORAGE_KEY = '@cart_items'

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([])
	const [loading, setLoading] = useState(true)

	// Загружаем корзину при старте
	useEffect(() => {
		loadCart()
	}, [])

	const loadCart = async () => {
		try {
			console.log('📦 Загрузка корзины из AsyncStorage')
			const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY)
			if (savedCart) {
				const parsedCart = JSON.parse(savedCart)
				console.log('✅ Загружено товаров:', parsedCart.length)
				setCart(parsedCart)
			} else {
				console.log('ℹ️ Корзина пуста')
				setCart([])
			}
		} catch (error) {
			console.error('❌ Ошибка загрузки:', error)
		} finally {
			setLoading(false)
		}
	}

	const saveCart = async (items: CartItem[]) => {
		try {
			console.log('💾 Сохранение корзины:', items.length)
			await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
		} catch (error) {
			console.error('❌ Ошибка сохранения:', error)
		}
	}

	const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
		console.log('🛒 Добавление товара:', product.name)

		setCart(prevCart => {
			// Ищем существующий товар
			const existingItem = prevCart.find(
				item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
			)

			let newCart: CartItem[]

			if (existingItem) {
				// Увеличиваем количество
				console.log('📈 Товар уже есть, увеличиваем количество')
				newCart = prevCart.map(item =>
					item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
						? { ...item, quantity: item.quantity + quantity }
						: item
				)
			} else {
				// Добавляем новый товар
				console.log('➕ Добавляем новый товар')
				newCart = [
					...prevCart,
					{
						id: product.id,
						name: product.name,
						price: product.price,
						quantity,
						image: product.images?.[0],
						selectedSize,
						selectedColor,
						maxQuantity: product.maxQuantity,
					},
				]
			}

			console.log('✅ Новая корзина, товаров:', newCart.length)
			saveCart(newCart)
			return newCart
		})
	}

	const removeFromCart = (itemId: string, selectedSize?: string, selectedColor?: string) => {
		console.log('🗑️ Удаление товара:', itemId)

		setCart(prev => {
			const newCart = prev.filter(
				item => !(item.id === itemId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
			)
			console.log('✅ После удаления, товаров:', newCart.length)
			saveCart(newCart)
			return newCart
		})
	}

	const updateQuantity = (itemId: string, newQuantity: number, selectedSize?: string, selectedColor?: string) => {
		if (newQuantity < 1) return

		console.log('📝 Обновление количества:', newQuantity)

		setCart(prev => {
			const newCart = prev.map(item =>
				item.id === itemId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
					? { ...item, quantity: newQuantity }
					: item
			)
			saveCart(newCart)
			return newCart
		})
	}

	const clearCart = () => {
		console.log('🧹 Очистка корзины')
		setCart([])
		saveCart([])
	}

	const getTotalPrice = () => {
		return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
	}

	const getTotalItems = () => {
		return cart.reduce((sum, item) => sum + item.quantity, 0)
	}

	const isInCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
		return cart.some(
			item => item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
		)
	}

	const getItemQuantity = (productId: string, selectedSize?: string, selectedColor?: string) => {
		const item = cart.find(
			item => item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
		)
		return item?.quantity || 0
	}

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getTotalPrice,
				getTotalItems,
				isInCart,
				getItemQuantity,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}

export function useCart() {
	const context = useContext(CartContext)
	if (!context) {
		throw new Error('useCart must be used within CartProvider')
	}
	return context
}
