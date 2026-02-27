// components/ui/BottomTabBar.tsx
import { Ionicons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface TabItem {
	name: string
	title: string
	icon: keyof typeof Ionicons.glyphMap
	iconFocused: keyof typeof Ionicons.glyphMap
}

const tabs: TabItem[] = [
	{
		name: 'shop',
		title: 'Магазин',
		icon: 'storefront-outline',
		iconFocused: 'storefront',
	},
	{
		name: 'cart',
		title: 'Корзина',
		icon: 'cart-outline',
		iconFocused: 'cart',
	},
	{
		name: 'profile',
		title: 'Профиль',
		icon: 'person-outline',
		iconFocused: 'person',
	},
]

export default function BottomTabBar() {
	const router = useRouter()
	const pathname = usePathname()

	const isActive = (tabName: string) => {
		return pathname.includes(`/${tabName}`) || (tabName === 'shop' && pathname === '/(home)')
	}

	return (
		<View style={styles.container}>
			{tabs.map(tab => {
				const active = isActive(tab.name)

				return (
					<TouchableOpacity
						key={tab.name}
						style={styles.tab}
						onPress={() => router.push(`/${tab.name}` as any)}
					>
						<Ionicons
							name={active ? tab.iconFocused : tab.icon}
							size={24}
							color={active ? '#007AFF' : '#8E8E93'}
						/>
						<Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.title}</Text>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: '#ffffff',
		borderTopWidth: 1,
		borderTopColor: '#e5e5e5',
		height: 60,
		paddingBottom: 5,
		paddingTop: 5,
	},
	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 2,
	},
	tabLabel: {
		fontSize: 11,
		color: '#8E8E93',
	},
	tabLabelActive: {
		color: '#007AFF',
		fontWeight: '500',
	},
})
