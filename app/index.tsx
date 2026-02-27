import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useUser } from '../hooks/useUser'

export default function HomeScreen() {
	const { user, logout } = useUser()
	const router = useRouter()

	const handleLogout = async () => {
		await logout()
		router.push('/login')
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Добро пожаловать!</Text>
			<Text style={styles.email}>{user?.email}</Text>

			<TouchableOpacity
				style={styles.button}
				onPress={handleLogout}
			>
				<Text style={styles.buttonText}>Выйти</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#333',
	},
	email: {
		fontSize: 18,
		color: '#666',
		marginBottom: 40,
	},
	button: {
		backgroundColor: '#FF3B30',
		padding: 15,
		borderRadius: 8,
		minWidth: 200,
	},
	buttonText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '600',
	},
})
