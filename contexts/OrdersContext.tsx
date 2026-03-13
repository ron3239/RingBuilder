// contexts/OrdersContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

export interface OrderItem {
	name: string
	price: number
	quantity: number
	selectedSize?: string
}

export interface Order {
	id: string
	number: string
	date: string
	status: 'Обрабатывается' | 'В пути' | 'Доставлен'
	items: OrderItem[]
	total: number
}

interface OrdersContextType {
	orders: Order[]
	addOrder: (items: OrderItem[], total: number) => void
	loading: boolean
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const ORDERS_STORAGE_KEY = '@orders'

export function OrdersProvider({ children }: { children: React.ReactNode }) {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadOrders()
	}, [])

	const loadOrders = async () => {
		try {
			const savedOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY)
			if (savedOrders) {
				setOrders(JSON.parse(savedOrders))
			}
		} catch (error) {
			console.error('Error loading orders:', error)
		} finally {
			setLoading(false)
		}
	}

	const saveOrders = async (newOrders: Order[]) => {
		try {
			await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders))
		} catch (error) {
			console.error('Error saving orders:', error)
		}
	}

	const addOrder = (items: OrderItem[], total: number) => {
		const newOrder: Order = {
			id: Date.now().toString(),
			number: `Заказ #${Date.now().toString().slice(-4)}`,
			date: new Date().toLocaleDateString('ru-RU'),
			status: 'Обрабатывается',
			items,
			total,
		}

		const updatedOrders = [newOrder, ...orders]
		setOrders(updatedOrders)
		saveOrders(updatedOrders)
	}

	return (
		<OrdersContext.Provider value={{ orders, addOrder, loading }}>
			{children}
		</OrdersContext.Provider>
	)
}

export function useOrders() {
	const context = useContext(OrdersContext)
	if (context === undefined) {
		throw new Error('useOrders must be used within an OrdersProvider')
	}
	return context
}
