// app/(home)/profile.tsx
import { useUser } from '@/hooks/useUser'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function ProfileScreen() {
	const { user, logout } = useUser()
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleLogout = () => {
		Alert.alert('Выход из аккаунта', 'Вы уверены, что хотите выйти?', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Выйти',
				style: 'destructive',
				onPress: async () => {
					setLoading(true)
					try {
						await logout()
						router.replace('/(auth)/login')
					} catch (error) {
						Alert.alert('Ошибка', 'Не удалось выйти')
					} finally {
						setLoading(false)
					}
				},
			},
		])
	}

	const menuItems = [
		{
			id: 'about',
			icon: 'information-circle-outline' as const,
			title: 'О приложении',
			onPress: () =>
				Alert.alert('RingBuilder', 'Версия 1.0.0\n\n3D конструктор ювелирных украшений\n© 2026 Все права защищены'),
		},
	]

	return (
		<ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
		>
			{/* Шапка профиля */}
			<View style={styles.header}>
				<View style={styles.avatarContainer}>
					<Text style={styles.avatarText}>{user?.username?.[0]?.toUpperCase() || 'U'}</Text>
				</View>
				<Text style={styles.userName}>{user?.username || 'Пользователь'}</Text>
			<Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
			</View>

			{/* Меню */}
			<View style={styles.menuContainer}>
				{menuItems.map((item, index) => (
					<TouchableOpacity
						key={item.id}
						style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
						onPress={item.onPress}
						disabled={loading}
					>
						<View style={styles.menuItemLeft}>
							<View style={styles.menuIconContainer}>
								<Ionicons
									name={item.icon}
									size={22}
									color='#007AFF'
								/>
							</View>
							<Text style={styles.menuItemTitle}>{item.title}</Text>
						</View>
					<View style={styles.menuItemRight}>
							{/* badge && (
								<View style={styles.badge}>
									<Text style={styles.badgeText}>{badge}</Text>
								</View>
							)*/}
							<Ionicons
								name='chevron-forward'
								size={20}
								color='#C7C7CC'
							/>
						</View>
					</TouchableOpacity>
				))}
			</View>

			{/* Кнопка выхода */}
			<TouchableOpacity
				style={styles.logoutButton}
				onPress={handleLogout}
				disabled={loading}
			>
				<Ionicons
					name='log-out-outline'
					size={22}
					color={loading ? '#999' : '#FF3B30'}
				/>
				<Text style={[styles.logoutButtonText, loading && styles.logoutButtonTextDisabled]}>
					{loading ? 'Выход...' : 'Выйти из аккаунта'}
				</Text>
			</TouchableOpacity>

			{/* Версия приложения */}
			<Text style={styles.versionText}>RingBuilder v1.0.0</Text>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	// Шапка профиля
	header: {
		backgroundColor: '#fff',
		alignItems: 'center',
		paddingTop: 30,
		paddingBottom: 25,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	avatarContainer: {
		width: 90,
		height: 90,
		borderRadius: 45,
		backgroundColor: '#007AFF',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
		shadowColor: '#007AFF',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 5,
	},
	avatarText: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#fff',
	},
	userName: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 5,
	},
	userEmail: {
		fontSize: 14,
		color: '#666',
		marginBottom: 15,
	},
	editButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: '#f0f0f0',
	},
	editButtonText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#007AFF',
	},
	// Статистика
	statsContainer: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		paddingVertical: 20,
		marginTop: 10,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#f0f0f0',
	},
	statItem: {
		flex: 1,
		alignItems: 'center',
	},
	statValue: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	statLabel: {
		fontSize: 13,
		color: '#666',
		marginTop: 5,
	},
	statDivider: {
		width: 1,
		height: '80%',
		backgroundColor: '#f0f0f0',
		alignSelf: 'center',
	},
	// Меню
	menuContainer: {
		backgroundColor: '#fff',
		marginTop: 10,
		paddingHorizontal: 15,
	},
	menuItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	menuItemLast: {
		borderBottomWidth: 0,
	},
	menuItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 15,
	},
	menuIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#f0f9ff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	menuItemTitle: {
		fontSize: 16,
		color: '#333',
	},
	menuItemRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	badge: {
		backgroundColor: '#FF3B30',
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 2,
		minWidth: 24,
		alignItems: 'center',
	},
	badgeText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: 'bold',
	},
	// Кнопка выхода
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		backgroundColor: '#fff',
		marginTop: 20,
		marginHorizontal: 15,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#FF3B30',
	},
	logoutButtonText: {
		color: '#FF3B30',
		fontSize: 16,
		fontWeight: '600',
	},
	logoutButtonTextDisabled: {
		color: '#999',
	},
	// Версия
	versionText: {
		textAlign: 'center',
		color: '#999',
		fontSize: 12,
		marginTop: 20,
		marginBottom: 30,
	},
})
