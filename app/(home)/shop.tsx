// app/(home)/shop.tsx
import { useCart } from '@/hooks/useTovars'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const PRODUCTS = [
	{
		id: '1',
		name: 'Кольцо с бриллиантом',
		price: 45000,
		images: ['https://via.placeholder.com/150'],
		sizes: ['16', '17', '18', '19', '20'],
		maxQuantity: 5,
	},
	{
		id: '2',
		name: 'Подвеска с сапфиром',
		price: 32000,
		images: ['https://via.placeholder.com/150'],
		maxQuantity: 3,
	},
	{
		id: '3',
		name: 'Серьги изумрудные',
		price: 67000,
		images: ['https://via.placeholder.com/150'],
		sizes: ['S', 'M', 'L'],
		maxQuantity: 2,
	},
]

export default function ShopScreen() {
	const { addToCart, removeFromCart, isInCart, getItemQuantity } = useCart()
	const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
	const router = useRouter()

	const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
		const selectedSize = product.sizes ? selectedSizes[product.id] : undefined

		if (product.sizes && !selectedSize) {
			Alert.alert('Выберите размер', 'Пожалуйста, выберите размер перед добавлением в корзину')
			return
		}

		addToCart(product, 1, selectedSize)
	}

	const handleRemoveFromCart = (product: (typeof PRODUCTS)[0]) => {
		const selectedSize = product.sizes ? selectedSizes[product.id] : undefined

		Alert.alert('Удаление товара', 'Вы уверены, что хотите удалить товар из корзины?', [
			{ text: 'Отмена', style: 'cancel' },
			{
				text: 'Удалить',
				style: 'destructive',
				onPress: () => removeFromCart(product.id, selectedSize),
			},
		])
	}

	const handleGoToCart = () => {
		router.push('/(home)/cart') // Правильный путь
	}

	const handleCheckout = () => {
		router.push('/(home)/cart') // Тоже правильно, но можно сразу в checkout
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={PRODUCTS}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => {
					const selectedSize = item.sizes ? selectedSizes[item.id] : undefined
					const inCart = isInCart(item.id, selectedSize)
					const quantity = getItemQuantity(item.id, selectedSize)

					return (
						<View style={styles.productCard}>
							<Image
								source={{ uri: item.images[0] }}
								style={styles.productImage}
							/>

							<View style={styles.productInfo}>
								<Text style={styles.productName}>{item.name}</Text>
								<Text style={styles.productPrice}>{item.price.toLocaleString()} ₽</Text>

								{/* Выбор размера */}
								{item.sizes && (
									<View style={styles.sizes}>
										<Text style={styles.sizesLabel}>Размер:</Text>
										<View style={styles.sizesList}>
											{item.sizes.map(size => (
												<TouchableOpacity
													key={size}
													style={[styles.sizeButton, selectedSizes[item.id] === size && styles.sizeButtonSelected]}
													onPress={() => setSelectedSizes(prev => ({ ...prev, [item.id]: size }))}
												>
													<Text style={[styles.sizeText, selectedSizes[item.id] === size && styles.sizeTextSelected]}>
														{size}
													</Text>
												</TouchableOpacity>
											))}
										</View>
									</View>
								)}

								{inCart ? (
									// Если товар в корзине - показываем блок с действиями
									<View style={styles.cartActions}>
										<View style={styles.quantityBadge}>
											<Ionicons
												name='cart'
												size={16}
												color='#007AFF'
											/>
											<Text style={styles.quantityBadgeText}>{quantity} шт.</Text>
										</View>

										<View style={styles.actionButtons}>
											<TouchableOpacity
												style={[styles.actionButton, styles.removeButton]}
												onPress={() => handleRemoveFromCart(item)}
											>
												<Ionicons
													name='trash-outline'
													size={18}
													color='#FF3B30'
												/>
												<Text style={styles.removeButtonText}>Удалить</Text>
											</TouchableOpacity>

											<TouchableOpacity
												style={[styles.actionButton, styles.checkoutButton]}
												onPress={handleCheckout}
											>
												<Text style={styles.checkoutButtonText}>Оформить</Text>
											</TouchableOpacity>
										</View>
									</View>
								) : (
									// Если товара нет в корзине - показываем кнопку "В корзину"
									<TouchableOpacity
										style={styles.addButton}
										onPress={() => handleAddToCart(item)}
									>
										<Ionicons
											name='cart-outline'
											size={20}
											color='#fff'
										/>
										<Text style={styles.addButtonText}>В корзину</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>
					)
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		marginTop: 30,
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
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
	cartLink: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingVertical: 6,
		paddingHorizontal: 12,
		backgroundColor: '#f0f9ff',
		borderRadius: 20,
	},
	cartLinkText: {
		color: '#007AFF',
		fontSize: 14,
		fontWeight: '500',
	},
	list: {
		padding: 15,
	},
	productCard: {
		backgroundColor: '#fff',
		marginBottom: 15,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	productImage: {
		width: '100%',
		height: 200,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	productInfo: {
		padding: 15,
	},
	productName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	productPrice: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#007AFF',
		marginTop: 5,
	},
	sizes: {
		marginTop: 15,
	},
	sizesLabel: {
		fontSize: 14,
		color: '#666',
		marginBottom: 8,
	},
	sizesList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	sizeButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		borderWidth: 1,
		borderColor: '#ddd',
		justifyContent: 'center',
		alignItems: 'center',
	},
	sizeButtonSelected: {
		backgroundColor: '#007AFF',
		borderColor: '#007AFF',
	},
	sizeText: {
		fontSize: 14,
		color: '#333',
	},
	sizeTextSelected: {
		color: '#fff',
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#007AFF',
		padding: 14,
		borderRadius: 8,
		marginTop: 15,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	cartActions: {
		marginTop: 15,
		gap: 12,
	},
	quantityBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: '#f0f9ff',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20,
		alignSelf: 'flex-start',
	},
	quantityBadgeText: {
		color: '#007AFF',
		fontSize: 14,
		fontWeight: '500',
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 10,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		padding: 12,
		borderRadius: 8,
	},
	removeButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#FF3B30',
	},
	removeButtonText: {
		color: '#FF3B30',
		fontSize: 14,
		fontWeight: '500',
	},
	checkoutButton: {
		backgroundColor: '#007AFF',
	},
	checkoutButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
})
