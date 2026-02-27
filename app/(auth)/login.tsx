import { useUser } from '@/hooks/useUser'
import { api } from '@/services/api'
import { validatePassword, validateUsername } from '@/types/user'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function LoginScreen() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { saveUser } = useUser()

	const handleLogin = async () => {
		// Валидация
		const usernameError = validateUsername(username)
		if (usernameError) {
			Alert.alert('Ошибка', usernameError)
			return
		}

		const passwordError = validatePassword(password)
		if (passwordError) {
			Alert.alert('Ошибка', passwordError)
			return
		}

		setLoading(true)
		try {
			const response = await api.login({ username, password })
			await saveUser(response.user, response.tokens.accessToken, response.tokens.refreshToken)
			Alert.alert('Успех', 'Вы вошли в систему!')
			router.replace('/shop')
		} catch (error: any) {
			Alert.alert('Ошибка', error.message || 'Не удалось войти')
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Вход</Text>

			<TextInput
				style={styles.input}
				placeholder='Имя пользователя'
				value={username}
				onChangeText={setUsername}
				autoCapitalize='none'
				editable={!loading}
			/>

			<TextInput
				style={styles.input}
				placeholder='Пароль'
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				editable={!loading}
			/>

			<TouchableOpacity
				style={[styles.button, loading && styles.buttonDisabled]}
				onPress={handleLogin}
				disabled={loading}
			>
				<Text style={styles.buttonText}>{loading ? 'Вход...' : 'Войти'}</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => router.push('/register')}
				disabled={loading}
			>
				<Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 40,
		textAlign: 'center',
		color: '#333',
	},
	input: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 8,
		marginBottom: 15,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	button: {
		backgroundColor: '#007AFF',
		padding: 15,
		borderRadius: 8,
		marginTop: 10,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: '600',
	},
	link: {
		color: '#007AFF',
		textAlign: 'center',
		marginTop: 20,
		fontSize: 14,
	},
})
