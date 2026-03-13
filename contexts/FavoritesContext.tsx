// contexts/FavoritesContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

export interface FavoriteItem {
	id: string
	name: string
	price: number
	image: any
	metal: string
}

interface FavoritesContextType {
	favorites: FavoriteItem[]
	addFavorite: (item: Omit<FavoriteItem, 'id'>, productId: string) => void
	removeFavorite: (id: string) => void
	isFavorite: (id: string) => boolean
	loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = '@favorites'

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
	const [favorites, setFavorites] = useState<FavoriteItem[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadFavorites()
	}, [])

	const loadFavorites = async () => {
		try {
			const saved = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
			if (saved) {
				setFavorites(JSON.parse(saved))
			}
		} catch (error) {
			console.error('Error loading favorites:', error)
		} finally {
			setLoading(false)
		}
	}

	const saveFavorites = async (newFavorites: FavoriteItem[]) => {
		try {
			await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
		} catch (error) {
			console.error('Error saving favorites:', error)
		}
	}

	const addFavorite = (item: Omit<FavoriteItem, 'id'>, productId: string) => {
		const newFavorite: FavoriteItem = {
			...item,
			id: productId,
		}
		const updated = [...favorites, newFavorite]
		setFavorites(updated)
		saveFavorites(updated)
	}

	const removeFavorite = (id: string) => {
		const updated = favorites.filter(f => f.id !== id)
		setFavorites(updated)
		saveFavorites(updated)
	}

	const isFavorite = (id: string) => {
		return favorites.some(f => f.id === id)
	}

	return (
		<FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, loading }}>
			{children}
		</FavoritesContext.Provider>
	)
}

export function useFavorites() {
	const context = useContext(FavoritesContext)
	if (context === undefined) {
		throw new Error('useFavorites must be used within a FavoritesProvider')
	}
	return context
}
