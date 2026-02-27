import LoadingScreen from '@/components/layout/loading'
import { CartProvider } from '@/contexts/CartContext'
import { useUser } from '@/hooks/useUser'
import { router, Stack } from 'expo-router'
import { useEffect } from 'react'

export default function RootLayout() {
	const { user, loading } = useUser()

	useEffect(() => {
		if (!loading) {
			if (user) {
				// Если пользователь авторизован, перенаправляем на главную
				router.replace('/shop')
			} else {
				// Если не авторизован, на экран входа
				router.replace('/login')
			}
		}
	}, [user, loading])

	// Пока загружаемся, показываем пустой экран или сплеш-скрин
	if (loading) {
		return <LoadingScreen />
	}

	return (
		<CartProvider>
			<Stack>
				<Stack.Screen
					name='(auth)'
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name='(home)'
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name='index'
					options={{ headerShown: false }}
				/>
			</Stack>
		</CartProvider>
	)
}
