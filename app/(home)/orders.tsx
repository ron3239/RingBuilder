// app/(home)/orders.tsx
import { useOrders, Order } from '@/contexts/OrdersContext'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function OrdersScreen() {
	const router = useRouter()
	const { orders, loading } = useOrders()

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Доставлен': return '#34C759'
			case 'В пути': return '#FF9500'
			case 'Обрабатывается': return '#007AFF'
			default: return '#8E8E93'
		}
	}

	const renderOrder = ({ item }: { item: Order }) => (
		<View style={styles.orderCard}>
			<View style={styles.orderHeader}>
				<Text style={styles.orderNumber}>{item.number}</Text>
				<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
					<Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
				</View>
			</View>

			<Text style={styles.orderDate}>{item.date}</Text>

			<View style={styles.itemsContainer}>
				{item.items.map((orderItem, index) => (
					<Text key={index} style={styles.itemText}>
						{orderItem.name} x{orderItem.quantity}
					</Text>
				))}
			</View>

			<View style={styles.orderFooter}>
				<Text style={styles.totalLabel}>Итого:</Text>
				<Text style={styles.totalValue}>{item.total.toLocaleString()} ₽</Text>
			</View>
		</View>
	)

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Мои заказы</Text>
				<View style={{ width: 40 }} />
			</View>

			<FlatList
				data={orders}
				keyExtractor={item => item.id}
				renderItem={renderOrder}
				contentContainerStyle={styles.list}
				ListEmptyComponent={
					!loading ? (
						<View style={styles.emptyContainer}>
							<Ionicons name="bag-outline" size={60} color="#C7C7CC" />
							<Text style={styles.emptyText}>У вас пока нет заказов</Text>
						</View>
					) : null
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
	orderCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	orderHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	orderNumber: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '500',
	},
	orderDate: {
		fontSize: 14,
		color: '#666',
		marginBottom: 12,
	},
	itemsContainer: {
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#f0f0f0',
		paddingVertical: 12,
		marginBottom: 12,
	},
	itemText: {
		fontSize: 14,
		color: '#333',
		marginBottom: 4,
	},
	orderFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	totalLabel: {
		fontSize: 14,
		color: '#666',
	},
	totalValue: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#007AFF',
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
})
