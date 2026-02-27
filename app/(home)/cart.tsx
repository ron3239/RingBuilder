// app/(home)/cart.tsx
import { useCart } from '@/hooks/useTovars'
import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function CartScreen() {
	const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()

	// ВАЖНО: Добавьте это логирование
	console.log('🛍️ CartScreen РЕНДЕРИТСЯ')
	console.log('📦 Товары в корзине:', cart)
	console.log('📊 Количество товаров:', cart.length)

	useEffect(() => {
		console.log('🔄 CartScreen useEffect - корзина изменилась:', cart)
	}, [cart])

	const total = getTotalPrice()
	console.log('💰 Общая сумма:', total)

	const handleCheckout = () => {
		Alert.alert('Оформление заказа', `Общая сумма: ${total.toLocaleString()} ₽\n\nЖелаете оформить заказ?`, [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Оформить',
				onPress: () => {
					// Здесь будет логика оформления заказа
					Alert.alert('Успешно', 'Заказ оформлен!')
					// Очищаем корзину после оформления
					// clearCart() // Раскомментировать когда будет готова логика
				},
			},
		])
	}

	const handleClearCart = () => {
		Alert.alert('Очистка корзины', 'Вы уверены, что хотите удалить все товары из корзины?', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Очистить',
				style: 'destructive',
				onPress: clearCart,
			},
		])
	}

	if (cart.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Ionicons
					name='cart-outline'
					size={80}
					color='#ccc'
				/>
				<Text style={styles.emptyTitle}>Корзина пуста</Text>
				<Text style={styles.emptySubtitle}>Добавьте товары из магазина</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			{/* Шапка с кнопкой очистки */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Корзина</Text>
				<TouchableOpacity onPress={handleClearCart}>
					<Text style={styles.clearButton}>Очистить</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={cart}
				keyExtractor={(item, index) => `${item.id}-${item.selectedSize || ''}-${index}`}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => (
					<View style={styles.cartItem}>
						{/* Изображение товара (если есть) */}
						{item.image && (
							<View style={styles.imagePlaceholder}>
								<Ionicons
									name='image-outline'
									size={30}
									color='#ccc'
								/>
							</View>
						)}

						<View style={styles.itemInfo}>
							<Text style={styles.itemName}>{item.name}</Text>

							{/* Дополнительные параметры товара */}
							<View style={styles.itemDetails}>
								{item.selectedSize && <Text style={styles.itemDetail}>Размер: {item.selectedSize}</Text>}
								{item.selectedColor && <Text style={styles.itemDetail}>Цвет: {item.selectedColor}</Text>}
							</View>

							<Text style={styles.itemPrice}>{item.price.toLocaleString()} ₽</Text>

							<View style={styles.quantityRow}>
								<View style={styles.quantity}>
									<TouchableOpacity
										onPress={() => {
											if (item.quantity > 1) {
												updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)
											} else {
												// Если количество 1, показываем диалог удаления
												Alert.alert('Удаление товара', 'Удалить товар из корзины?', [
													{ text: 'Отмена', style: 'cancel' },
													{
														text: 'Удалить',
														style: 'destructive',
														onPress: () => removeFromCart(item.id, item.selectedSize, item.selectedColor),
													},
												])
											}
										}}
									>
										<Ionicons
											name='remove-circle-outline'
											size={24}
											color='#007AFF'
										/>
									</TouchableOpacity>

									<Text style={styles.quantityText}>{item.quantity}</Text>

									<TouchableOpacity
										onPress={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
									>
										<Ionicons
											name='add-circle-outline'
											size={24}
											color='#007AFF'
										/>
									</TouchableOpacity>
								</View>

								<TouchableOpacity
									onPress={() => {
										Alert.alert('Удаление товара', 'Удалить товар из корзины?', [
											{ text: 'Отмена', style: 'cancel' },
											{
												text: 'Удалить',
												style: 'destructive',
												onPress: () => removeFromCart(item.id, item.selectedSize, item.selectedColor),
											},
										])
									}}
								>
									<Ionicons
										name='trash-outline'
										size={22}
										color='#FF3B30'
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
			/>

			<View style={styles.footer}>
				<View style={styles.total}>
					<Text style={styles.totalText}>Итого:</Text>
					<Text style={styles.totalPrice}>{total.toLocaleString()} ₽</Text>
				</View>
				<View style={styles.footerButtons}>
					<TouchableOpacity
						style={styles.clearFooterButton}
						onPress={handleClearCart}
					>
						<Text style={styles.clearFooterButtonText}>Очистить</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.checkoutButton}
						onPress={handleCheckout}
					>
						<Text style={styles.checkoutButtonText}>Оформить заказ</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 10,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5e5',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	clearButton: {
		color: '#FF3B30',
		fontSize: 14,
		fontWeight: '500',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
		marginTop: 20,
	},
	emptySubtitle: {
		fontSize: 14,
		color: '#666',
		marginTop: 5,
		textAlign: 'center',
	},
	list: {
		padding: 15,
	},
	cartItem: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 12,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		gap: 15,
	},
	imagePlaceholder: {
		width: 70,
		height: 70,
		backgroundColor: '#f0f0f0',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemInfo: {
		flex: 1,
	},
	itemName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	itemDetails: {
		marginBottom: 4,
	},
	itemDetail: {
		fontSize: 13,
		color: '#666',
	},
	itemPrice: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#007AFF',
		marginVertical: 6,
	},
	quantityRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	quantity: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 15,
	},
	quantityText: {
		fontSize: 16,
		fontWeight: '600',
		minWidth: 30,
		textAlign: 'center',
	},
	footer: {
		backgroundColor: '#fff',
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: '#e5e5e5',
	},
	total: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	totalText: {
		fontSize: 16,
		color: '#666',
	},
	totalPrice: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	footerButtons: {
		flexDirection: 'row',
		gap: 10,
	},
	clearFooterButton: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#FF3B30',
	},
	clearFooterButtonText: {
		color: '#FF3B30',
		fontSize: 16,
		fontWeight: '600',
	},
	checkoutButton: {
		flex: 2,
		backgroundColor: '#007AFF',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
	},
	checkoutButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})
