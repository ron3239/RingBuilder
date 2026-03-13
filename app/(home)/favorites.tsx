// app/(home)/favorites.tsx
import { useCart } from '@/contexts/CartContext'
import { useFavorites, FavoriteItem } from '@/contexts/FavoritesContext'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function FavoritesScreen() {
	const router = useRouter()
	const { favorites, removeFavorite } = useFavorites()
	const { addToCart } = useCart()

	const handleAddToCart = (item: FavoriteItem) => {
		addToCart({
			id: item.id,
			name: item.name,
			price: item.price,
			images: [item.image],
		}, 1)
		removeFavorite(item.id)
	}

	const renderItem = ({ item }: { item: FavoriteItem }) => (
		<View style={styles.favoriteCard}>
			<Image source={item.image} style={styles.productImage} />
			<View style={styles.productInfo}>
				<Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
				<Text style={styles.productMetal}>{item.metal}</Text>
				<Text style={styles.productPrice}>{item.price.toLocaleString()} ₽</Text>
				<View style={styles.actionButtons}>
					<TouchableOpacity 
						style={styles.cartButton}
						onPress={() => handleAddToCart(item)}
					>
						<Ionicons name="cart-outline" size={20} color="#fff" />
						<Text style={styles.cartButtonText}>В корзину</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.deleteButton}
						onPress={() => removeFavorite(item.id)}
					>
						<Ionicons name="trash-outline" size={20} color="#FF3B30" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Избранное</Text>
				<View style={{ width: 40 }} />
			</View>

			<FlatList
				data={favorites}
				keyExtractor={item => item.id}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Ionicons name="heart-outline" size={60} color="#C7C7CC" />
						<Text style={styles.emptyText}>У вас пока нет избранных товаров</Text>
						<Text style={styles.emptySubtext}>Добавьте товары в избранное</Text>
					</View>
				}
			/>
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
		paddingBottom: 15,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5e5',
	},
	backButton: {
		padding: 5,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	list: {
		padding: 15,
	},
	favoriteCard: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	productImage: {
		width: 100,
		height: 100,
		borderRadius: 12,
	},
	productInfo: {
		flex: 1,
		marginLeft: 12,
		justifyContent: 'space-between',
	},
	productName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	productMetal: {
		fontSize: 13,
		color: '#666',
		marginTop: 2,
	},
	productPrice: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#007AFF',
		marginTop: 4,
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 10,
	},
	cartButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#007AFF',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 10,
		gap: 6,
	},
	cartButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
	deleteButton: {
		padding: 8,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 100,
	},
	emptyText: {
		fontSize: 16,
		color: '#8E8E93',
		marginTop: 15,
	},
	emptySubtext: {
		fontSize: 14,
		color: '#C7C7CC',
		marginTop: 5,
	},
})
