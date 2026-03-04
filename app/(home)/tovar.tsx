// app/(home)/tovar.tsx
import RingViewer from '@/components/models/RingViewer'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function TovarScreen() {
	const [metalColor, setMetalColor] = useState('#ffd700') // золото
	const [stoneColor, setStoneColor] = useState('#ffffff') // бриллиант
	const [selectedSize, setSelectedSize] = useState('17')
	const [modelLoaded, setModelLoaded] = useState(false)

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
		<ScrollView style={styles.container}>
			<View style={styles.viewerContainer}>
				<RingViewer
					metalColor={metalColor}
					stoneColor={stoneColor}
					autoRotate={!modelLoaded}
					onLoad={() => setModelLoaded(true)}
				/>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>Кольцо с бриллиантом</Text>
				<Text style={styles.price}>45 000 ₽</Text>

				<Text style={styles.sectionTitle}>Металл</Text>
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

				<Text style={styles.sectionTitle}>Камень</Text>
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

				{/* Размер */}
				<Text style={styles.sectionTitle}>Размер</Text>
				<View style={styles.sizes}>
					{['16', '17', '18', '19', '20'].map(size => (
						<TouchableOpacity
							key={size}
							style={[styles.sizeButton, selectedSize === size && styles.sizeButtonSelected]}
							onPress={() => setSelectedSize(size)}
						>
							<Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>{size}</Text>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity style={styles.addButton}>
					<Text style={styles.addButtonText}>В корзину</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	viewerContainer: {
		height: 400,
		backgroundColor: '#e8e8e8',
	},
	content: {
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
	price: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#007AFF',
		marginTop: 10,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#666',
		marginTop: 20,
		marginBottom: 12,
	},
	colorRow: {
		flexDirection: 'row',
		gap: 14,
	},
	colorCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: '#ddd',
	},
	colorCircleSelected: {
		borderColor: '#007AFF',
		borderWidth: 3,
	},
	sizes: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	sizeButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
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
		fontSize: 16,
		color: '#333',
	},
	sizeTextSelected: {
		color: '#fff',
	},
	addButton: {
		backgroundColor: '#007AFF',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 30,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})
