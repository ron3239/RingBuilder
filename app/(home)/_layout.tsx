// app/(home)/_layout.tsx
import BottomTabBar from '@/components/layout/footer'
import { Tabs } from 'expo-router'

export default function HomeLayout() {
	return (
		<Tabs
			tabBar={() => <BottomTabBar />}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name='shop'
				options={{ title: 'Магазин' }}
			/>
			<Tabs.Screen
				name='tovar'
				options={{ title: 'Конструктор' }}
			/>
			<Tabs.Screen
				name='cart'
				options={{ title: 'Корзина' }}
			/>
			<Tabs.Screen
				name='profile'
				options={{ title: 'Профиль' }}
			/>
		</Tabs>
	)
}
