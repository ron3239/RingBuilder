// app/(home)/_layout.tsx
import BottomTabBar from '@/components/layout/footer'
import { Tabs } from 'expo-router'

export default function HomeLayout() {
	return (
		<Tabs
			tabBar={() => <BottomTabBar />} // Используем кастомный футер
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor: '#ffffff',
				},
				headerTitleStyle: {
					marginTop: 10,
					fontSize: 18,
					fontWeight: '600',
					color: '#000',
				},
			}}
		>
			<Tabs.Screen
				name='shop'
				options={{
					title: 'Магазин',
				}}
			/>
			<Tabs.Screen
				name='cart'
				options={{
					title: 'Корзина',
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Профиль',
				}}
			/>
		</Tabs>
	)
}
