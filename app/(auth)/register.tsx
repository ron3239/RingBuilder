import { api } from '@/services/api'
import { validateEmail, validateName, validatePassword, validateUsername } from '@/types/user'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'

export default function RegisterScreen() {
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleRegister = async () => {
		// Валидация
		const emailError = validateEmail(email)
		if (emailError) {
			Alert.alert('Ошибка', emailError)
			return
		}

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

		if (password !== confirmPassword) {
			Alert.alert('Ошибка', 'Пароли не совпадают')
			return
		}

		const firstNameError = validateName(firstName, 'Имя')
		if (firstNameError) {
			Alert.alert('Ошибка', firstNameError)
			return
		}

		const lastNameError = validateName(lastName, 'Фамилия')
		if (lastNameError) {
			Alert.alert('Ошибка', lastNameError)
			return
		}

		setLoading(true)
		try {
			await api.register({
				email,
				username,
				password,
				firstName: firstName || undefined,
				lastName: lastName || undefined,
			})
			Alert.alert('Успех', 'Регистрация прошла успешно! Войдите в систему.')
			router.replace('/login')
		} catch (error: any) {
			Alert.alert('Ошибка', error.message || 'Не удалось зарегистрироваться')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
		>
			<Text style={styles.title}>Регистрация</Text>

			<TextInput
				style={styles.input}
				placeholder='Email *'
				value={email}
				onChangeText={setEmail}
				keyboardType='email-address'
				autoCapitalize='none'
				editable={!loading}
			/>

			<TextInput
				style={styles.input}
				placeholder='Имя пользователя * (3-50 символов)'
				value={username}
				onChangeText={setUsername}
				autoCapitalize='none'
				editable={!loading}
			/>

			<TextInput
				style={styles.input}
				placeholder='Пароль * (минимум 6 символов)'
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				editable={!loading}
			/>

			<TextInput
				style={styles.input}
				placeholder='Подтвердите пароль *'
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secureTextEntry
				editable={!loading}
			/>

			<TextInput
				style={styles.input}
				placeholder='Имя (необязательно)'
				value={firstName}
				onChangeText={setFirstName}
				editable={!loading}
			/>

			<TextInput
				style={styles.input}
				placeholder='Фамилия (необязательно)'
				value={lastName}
				onChangeText={setLastName}
				editable={!loading}
			/>

			<TouchableOpacity
				style={[styles.button, loading && styles.buttonDisabled]}
				onPress={handleRegister}
				disabled={loading}
			>
				<Text style={styles.buttonText}>{loading ? 'Регистрация...' : 'Зарегистрироваться'}</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => router.back()}
				disabled={loading}
			>
				<Text style={styles.link}>Уже есть аккаунт? Войти</Text>
			</TouchableOpacity>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	contentContainer: {
		padding: 20,
		paddingTop: 60,
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
		marginBottom: 40,
		fontSize: 14,
	},
})
