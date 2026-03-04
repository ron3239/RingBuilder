// app/(home)/product/[id].tsx
import { useCart } from '@/contexts/CartContext'
import RingViewer from '@/components/models/RingViewer'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const PRODUCTS = [
	{
		id: '1',
		name: 'Кольцо с бриллиантом',
		description: 'Элегантное золотое кольцо с бриллиантом. Идеальный выбор для помолвки или особого случая.',
		price: 45000,
		images: ['https://via.placeholder.com/150'],
		sizes: ['16', '17', '18', '19', '20'],
		maxQuantity: 5,
		model: 'ring',
		defaultMetalColor: '#ffd700',
		defaultStoneColor: '#ffffff',
	},
	{
		id: '2',
		name: 'Подвеска с сапфиром',
		description: 'Изящная подвеска с сапфиром в золотой оправе. Подчеркнёт вашу индивидуальность.',
		price: 32000,
		images: ['https://via.placeholder.com/150'],
		maxQuantity: 3,
		model: 'pendant_sapphire',
		defaultMetalColor: '#ffd700',
		defaultStoneColor: '#4169E1',
	},
	{
		id: '3',
		name: 'Серьги изумрудные',
		description: 'Роскошные серьги с изумрудами. Безупречное качество и изысканный дизайн.',
		price: 67000,
		images: ['https://via.placeholder.com/150'],
		sizes: ['S', 'M', 'L'],
		maxQuantity: 2,
		model: 'earrings_emerald',
		defaultMetalColor: '#ffd700',
		defaultStoneColor: '#50C878',
	},
]

function ModelViewer({ metalColor, stoneColor }: { metalColor: string; stoneColor: string }) {
	return (
		<View style={styles.canvasContainer}>
			<RingViewer metalColor={metalColor} stoneColor={stoneColor} />
		</View>
	)
}

export default function ProductScreen() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const router = useRouter()
	const { addToCart, isInCart, getItemQuantity } = useCart()
	const [selectedSize, setSelectedSize] = useState<string | undefined>()
	const [show3D, setShow3D] = useState(false)
	const [metalColor, setMetalColor] = useState('#ffd700')
	const [stoneColor, setStoneColor] = useState('#ffffff')

	const product = PRODUCTS.find(p => p.id === id)

	useEffect(() => {
		if (product?.sizes) {
			setSelectedSize(product.sizes[0])
		}
		if (product?.defaultMetalColor) {
			setMetalColor(product.defaultMetalColor)
		}
		if (product?.defaultStoneColor) {
			setStoneColor(product.defaultStoneColor)
		}
	}, [product])

	if (!product) {
		return (
			<View style={styles.container}>
				<Text>Товар не найден</Text>
			</View>
		)
	}

	const inCart = isInCart(product.id, selectedSize)
	const quantity = getItemQuantity(product.id, selectedSize)

	const handleAddToCart = () => {
		if (product.sizes && !selectedSize) {
			Alert.alert('Выберите размер', 'Пожалуйста, выберите размер перед добавлением в корзину')
			return
		}
		addToCart(product, 1, selectedSize)
	}

	const metalOptions = [
		{ name: 'Золото', color: '#ffd700' },
		{ name: 'Серебро', color: '#c0c0c0' },
		{ name: 'Розовое золото', color: '#ffc0cb' },
		{ name: 'Платина', color: '#e5e4e2' },
		{ name: 'Титан', color: '#878681' },
		{ name: 'Чёрное золото', color: '#2c2c2c' },
	]

	const stoneOptions = [
		{ name: 'Бриллиант', color: '#ffffff' },
		{ name: 'Рубин', color: '#e0115f' },
		{ name: 'Сапфир', color: '#0f52ba' },
		{ name: 'Изумруд', color: '#50c878' },
		{ name: 'Аметист', color: '#9966cc' },
		{ name: 'Топаз', color: '#ffc87c' },
	]

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Товар</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView style={styles.content}>
				{show3D ? (
					<View style={styles.canvasContainer}>
						<RingViewer metalColor={metalColor} stoneColor={stoneColor} />
					</View>
				) : (
					<Image source={{ uri: product.images[0] }} style={styles.productImage} />
				)}

				<View style={styles.viewToggle}>
					<TouchableOpacity
						style={[styles.toggleButton, !show3D && styles.toggleButtonActive]}
						onPress={() => setShow3D(false)}
					>
						<Text style={[styles.toggleText, !show3D && styles.toggleTextActive]}>Фото</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.toggleButton, show3D && styles.toggleButtonActive]}
						onPress={() => setShow3D(true)}
					>
						<Text style={[styles.toggleText, show3D && styles.toggleTextActive]}>3D Модель</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.info}>
					<Text style={styles.productName}>{product.name}</Text>
					<Text style={styles.productPrice}>{product.price.toLocaleString()} ₽</Text>
					<Text style={styles.productDescription}>{product.description}</Text>

					{product.sizes && (
						<View style={styles.sizesSection}>
							<Text style={styles.sizesLabel}>Размер:</Text>
							<View style={styles.sizesList}>
								{product.sizes.map(size => (
									<TouchableOpacity
										key={size}
										style={[styles.sizeButton, selectedSize === size && styles.sizeButtonSelected]}
										onPress={() => setSelectedSize(size)}
									>
										<Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>
											{size}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					<View style={styles.sizesSection}>
						<Text style={styles.sizesLabel}>Металл:</Text>
						<View style={styles.colorRow}>
							{metalOptions.map(metal => (
								<TouchableOpacity
									key={metal.name}
									style={[
										styles.colorCircle,
										{ backgroundColor: metal.color },
										metalColor === metal.color && styles.colorCircleSelected,
									]}
									onPress={() => setMetalColor(metal.color)}
								/>
							))}
						</View>
					</View>

					<View style={styles.sizesSection}>
						<Text style={styles.sizesLabel}>Камень:</Text>
						<View style={styles.colorRow}>
							{stoneOptions.map(stone => (
								<TouchableOpacity
									key={stone.name}
									style={[
										styles.colorCircle,
										{ backgroundColor: stone.color },
										stoneColor === stone.color && styles.colorCircleSelected,
									]}
									onPress={() => setStoneColor(stone.color)}
								/>
							))}
						</View>
					</View>

					{inCart ? (
						<View style={styles.cartInfo}>
							<View style={styles.quantityBadge}>
								<Ionicons name="cart" size={16} color="#007AFF" />
								<Text style={styles.quantityBadgeText}>{quantity} шт. в корзине</Text>
							</View>
							<TouchableOpacity
								style={styles.cartButton}
								onPress={() => router.push('/(home)/cart')}
							>
								<Text style={styles.cartButtonText}>Перейти в корзину</Text>
							</TouchableOpacity>
						</View>
					) : (
						<TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
							<Ionicons name="cart-outline" size={20} color="#fff" />
							<Text style={styles.addButtonText}>В корзину</Text>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
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
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5e5',
	},
	backButton: {
		padding: 8,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	content: {
		flex: 1,
	},
	canvasContainer: {
		height: 300,
		backgroundColor: '#e8e8e8',
	},
	modelHint: {
		position: 'absolute',
		bottom: 10,
		left: 0,
		right: 0,
		textAlign: 'center',
		color: '#888',
		fontSize: 12,
	},
	productImage: {
		width: '100%',
		height: 300,
	},
	viewToggle: {
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 12,
		gap: 10,
		backgroundColor: '#fff',
	},
	toggleButton: {
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 20,
		backgroundColor: '#f0f0f0',
	},
	toggleButtonActive: {
		backgroundColor: '#007AFF',
	},
	toggleText: {
		fontSize: 14,
		color: '#666',
	},
	toggleTextActive: {
		color: '#fff',
	},
	info: {
		padding: 16,
	},
	productName: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#333',
	},
	productPrice: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#007AFF',
		marginTop: 8,
	},
	productDescription: {
		fontSize: 14,
		color: '#666',
		marginTop: 12,
		lineHeight: 20,
	},
	sizesSection: {
		marginTop: 20,
	},
	sizesLabel: {
		fontSize: 14,
		color: '#666',
		marginBottom: 10,
	},
	sizesList: {
		flexDirection: 'row',
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
	colorRow: {
		flexDirection: 'row',
		gap: 12,
	},
	colorCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 2,
		borderColor: '#ddd',
	},
	colorCircleSelected: {
		borderColor: '#007AFF',
		borderWidth: 3,
	},
	cartInfo: {
		marginTop: 20,
		gap: 12,
	},
	quantityBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: '#f0f9ff',
		padding: 12,
		borderRadius: 8,
	},
	quantityBadgeText: {
		color: '#007AFF',
		fontSize: 14,
		fontWeight: '500',
	},
	cartButton: {
		backgroundColor: '#007AFF',
		padding: 14,
		borderRadius: 8,
		alignItems: 'center',
	},
	cartButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#007AFF',
		padding: 14,
		borderRadius: 8,
		marginTop: 20,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})
