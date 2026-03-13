// app/(home)/tovar.tsx
import RingViewer from '@/components/models/RingViewer'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { 
	Alert, 
	Dimensions, 
	Modal, 
	ScrollView, 
	StyleSheet, 
	Text, 
	TouchableOpacity, 
	View 
} from 'react-native'

const { width } = Dimensions.get('window')

type Step = 1 | 2 | 3 | 4

interface TooltipData {
	title: string
	content: string
}

const TOOLTIPS: Record<string, TooltipData> = {
	fineness: {
		title: 'Проба металла',
		content: '585 - 58.5% золота\n750 - 75% золота\n925 - 92.5% серебра',
	},
	clarity: {
		title: 'Чистота камня',
		content: 'IF - Без включений\nVVS - Очень малые включения\nVS - Малые включения\nSI - Включения видные глазу',
	},
	cut: {
		title: 'Огранка',
		content: 'Круглая - классика\nПринцесса - квадратная\nОвал - элегантность\nИзумруд - роскошь',
	},
}

export default function TovarScreen() {
	const [currentStep, setCurrentStep] = useState<Step>(1)
	const [metalColor, setMetalColor] = useState('#ffd700')
	const [fineness, setFineness] = useState<number>(750)
	const [clarity, setClarity] = useState('VVS')
	const [cut, setCut] = useState('Круглая')
	const [selectedSize, setSelectedSize] = useState('17')
	const [showTooltip, setShowTooltip] = useState<string | null>(null)

	const steps = [
		{ id: 1 as Step, title: 'Металл', icon: 'diamond-outline' },
		{ id: 2 as Step, title: 'Проба', icon: 'barcode-outline' },
		{ id: 3 as Step, title: 'Камень', icon: 'shuffle-outline' },
		{ id: 4 as Step, title: 'Размер', icon: 'resize-outline' },
	]

	const metalOptions = [
		{ name: 'Золото', color: '#ffd700', fineness: [585, 750] as const },
		{ name: 'Серебро', color: '#c0c0c0', fineness: [925] as const },
		{ name: 'Розовое золото', color: '#ffc0cb', fineness: [585, 750] as const },
		{ name: 'Платина', color: '#e5e4e2', fineness: [750, 950] as const },
	]

	const finenessOptions: Record<string, number[]> = {
		'Золото': [585, 750],
		'Серебро': [925],
		'Розовое золото': [585, 750],
		'Платина': [750, 950],
	}

	const clarityOptions = [
		{ name: 'IF', desc: 'Без включений' },
		{ name: 'VVS', desc: 'Очень малые' },
		{ name: 'VS', desc: 'Малые' },
		{ name: 'SI', desc: 'Видные глазу' },
	]

	const cutOptions = [
		{ name: 'Круглая', icon: 'ellipse-outline' },
		{ name: 'Принцесса', icon: 'square-outline' },
		{ name: 'Овал', icon: 'ellipse-vertical-outline' },
		{ name: 'Изумруд', icon: 'rectangle-outline' },
	]

	const sizeOptions = ['15', '16', '17', '18', '19', '20', '21', '22']

	const getMetalName = (color: string) => {
		const metal = metalOptions.find(m => m.color === color)
		return metal?.name || 'Золото'
	}

	const handleNext = () => {
		if (currentStep < 4) {
			setCurrentStep((currentStep + 1) as Step)
		}
	}

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((currentStep - 1) as Step)
		}
	}

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<View style={styles.stepContent}>
						<Text style={styles.stepTitle}>Выберите металл</Text>
						<View style={styles.optionsGrid}>
							{metalOptions.map(metal => (
								<TouchableOpacity
									key={metal.name}
									style={[
										styles.metalOption,
										{ backgroundColor: metal.color },
										metalColor === metal.color && styles.optionSelected,
									]}
									onPress={() => {
										setMetalColor(metal.color)
										setFineness(finenessOptions[metal.name][0])
									}}
								>
									<Text style={[
										styles.metalOptionText,
										metal.name === 'Серебро' && styles.darkText
									]}>
										{metal.name}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)

			case 2:
				return (
					<View style={styles.stepContent}>
						<View style={styles.tooltipHeader}>
							<Text style={styles.stepTitle}>Выберите пробу</Text>
							<TouchableOpacity 
								style={styles.infoButton}
								onPress={() => setShowTooltip('fineness')}
							>
								<Ionicons name="information-circle-outline" size={24} color="#007AFF" />
							</TouchableOpacity>
						</View>
						<View style={styles.finenessRow}>
							{finenessOptions[getMetalName(metalColor)].map(f => (
								<TouchableOpacity
									key={f}
									style={[
										styles.finenessOption,
										fineness === f && styles.optionSelected,
									]}
									onPress={() => setFineness(f as number)}
								>
									<Text style={[
										styles.finenessText,
										fineness === f && styles.optionSelectedText,
									]}>
										{f}
									</Text>
									<Text style={styles.finenessLabel}>проба</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)

			case 3:
				return (
					<View style={styles.stepContent}>
						<View style={styles.tooltipHeader}>
							<Text style={styles.stepTitle}>Чистота камня</Text>
							<TouchableOpacity 
								style={styles.infoButton}
								onPress={() => setShowTooltip('clarity')}
							>
								<Ionicons name="information-circle-outline" size={24} color="#007AFF" />
							</TouchableOpacity>
						</View>
						<View style={styles.optionsGrid}>
							{clarityOptions.map(opt => (
								<TouchableOpacity
									key={opt.name}
									style={[
										styles.clarityOption,
										clarity === opt.name && styles.optionSelected,
									]}
									onPress={() => setClarity(opt.name)}
								>
									<Text style={[styles.clarityName, clarity === opt.name && styles.optionSelectedText]}>
										{opt.name}
									</Text>
									<Text style={styles.clarityDesc}>{opt.desc}</Text>
								</TouchableOpacity>
							))}
						</View>

						<Text style={[styles.stepTitle, { marginTop: 30 }]}>Форма огранки</Text>
						<View style={styles.tooltipHeader}>
							<TouchableOpacity 
								style={styles.infoButton}
								onPress={() => setShowTooltip('cut')}
							>
								<Ionicons name="information-circle-outline" size={24} color="#007AFF" />
							</TouchableOpacity>
						</View>
						<View style={styles.cutRow}>
							{cutOptions.map(opt => (
								<TouchableOpacity
									key={opt.name}
									style={[
										styles.cutOption,
										cut === opt.name && styles.optionSelected,
									]}
									onPress={() => setCut(opt.name)}
								>
									<Ionicons 
										name={opt.icon as any} 
										size={28} 
										color={cut === opt.name ? '#fff' : '#666'} 
									/>
									<Text style={[styles.cutName, cut === opt.name && styles.optionSelectedText]}>
										{opt.name}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)

			case 4:
				return (
					<View style={styles.stepContent}>
						<Text style={styles.stepTitle}>Выберите размер</Text>
						<View style={styles.sizeGrid}>
							{sizeOptions.map(size => (
								<TouchableOpacity
									key={size}
									style={[
										styles.sizeOption,
										selectedSize === size && styles.optionSelected,
									]}
									onPress={() => setSelectedSize(size)}
								>
									<Text style={[styles.sizeText, selectedSize === size && styles.optionSelectedText]}>
										{size}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<View style={styles.summaryCard}>
							<Text style={styles.summaryTitle}>Итого:</Text>
							<Text style={styles.summaryPrice}>45 000 ₽</Text>
							<View style={styles.summaryDetails}>
								<Text style={styles.summaryText}>{getMetalName(metalColor)} {fineness}</Text>
								<Text style={styles.summaryText}>Чистота: {clarity}</Text>
								<Text style={styles.summaryText}>Огранка: {cut}</Text>
								<Text style={styles.summaryText}>Размер: {selectedSize}</Text>
							</View>
						</View>
					</View>
				)
		}
	}

	return (
		<View style={styles.container}>
			{/* 3D Viewer */}
			<View style={styles.viewerContainer}>
				<RingViewer
					metalColor={metalColor}
					modelName="ring"
					enableRotate={true}
				/>
			</View>

			{/* Step Wizard */}
			<View style={styles.wizardContainer}>
				{/* Progress Steps */}
				<View style={styles.stepsContainer}>
					{steps.map((step, index) => (
						<View key={step.id} style={styles.stepItem}>
							<TouchableOpacity
								style={[
									styles.stepCircle,
									currentStep === step.id && styles.stepCircleActive,
									currentStep > step.id && styles.stepCircleDone,
								]}
								onPress={() => setCurrentStep(step.id)}
							>
								{currentStep > step.id ? (
									<Ionicons name="checkmark" size={18} color="#fff" />
								) : (
									<Ionicons 
										name={step.icon as any}
										size={18} 
										color={currentStep === step.id ? '#fff' : '#666'} 
									/>
								)}
							</TouchableOpacity>
							<Text style={[
								styles.stepLabel,
								currentStep === step.id && styles.stepLabelActive,
							]}>
								{step.title}
							</Text>
							{index < steps.length - 1 && (
								<View style={[
									styles.stepLine,
									currentStep > step.id && styles.stepLineDone,
								]} />
							)}
						</View>
					))}
				</View>

				{/* Step Content */}
				<ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
					{renderStep()}
				</ScrollView>

				{/* Navigation Buttons */}
				<View style={styles.navButtons}>
					{currentStep > 1 && (
						<TouchableOpacity style={styles.backButton} onPress={handleBack}>
							<Ionicons name="arrow-back" size={20} color="#333" />
							<Text style={styles.backButtonText}>Назад</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity 
						style={[styles.nextButton, currentStep === 1 && styles.backButtonPlaceholder]} 
						onPress={handleNext}
					>
						<Text style={styles.nextButtonText}>
							{currentStep === 4 ? 'В корзину' : 'Далее'}
						</Text>
						{currentStep < 4 && <Ionicons name="arrow-forward" size={20} color="#fff" />}
					</TouchableOpacity>
				</View>
			</View>

			{/* Tooltip Modal */}
			<Modal
				visible={showTooltip !== null}
				transparent
				animationType="fade"
				onRequestClose={() => setShowTooltip(null)}
			>
				<TouchableOpacity 
					style={styles.modalOverlay}
					activeOpacity={1}
					onPress={() => setShowTooltip(null)}
				>
					<View style={styles.tooltipModal}>
						{showTooltip && TOOLTIPS[showTooltip] && (
							<>
								<Text style={styles.tooltipTitle}>{TOOLTIPS[showTooltip].title}</Text>
								<Text style={styles.tooltipContent}>{TOOLTIPS[showTooltip].content}</Text>
							</>
						)}
						<TouchableOpacity style={styles.tooltipClose} onPress={() => setShowTooltip(null)}>
							<Text style={styles.tooltipCloseText}>Понятно</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f8f8',
	},
	viewerContainer: {
		height: 300,
		backgroundColor: '#f0f0f0',
	},
	wizardContainer: {
		flex: 1,
		backgroundColor: '#fff',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		marginTop: -20,
		paddingTop: 20,
	},
	stepsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	stepItem: {
		alignItems: 'center',
		flex: 1,
	},
	stepCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 6,
	},
	stepCircleActive: {
		backgroundColor: '#007AFF',
	},
	stepCircleDone: {
		backgroundColor: '#34C759',
	},
	stepLabel: {
		fontSize: 11,
		color: '#666',
		textAlign: 'center',
	},
	stepLabelActive: {
		color: '#007AFF',
		fontWeight: '600',
	},
	stepLine: {
		position: 'absolute',
		top: 20,
		left: '60%',
		width: '80%',
		height: 2,
		backgroundColor: '#f0f0f0',
	},
	stepLineDone: {
		backgroundColor: '#34C759',
	},
	contentScroll: {
		flex: 1,
		paddingHorizontal: 20,
	},
	stepContent: {
		paddingBottom: 20,
	},
	stepTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
		marginBottom: 16,
		textAlign: 'center',
	},
	tooltipHeader: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	infoButton: {
		marginLeft: 8,
	},
	optionsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
	},
	metalOption: {
		width: (width - 80) / 2,
		height: 70,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	metalOptionText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
		textShadowColor: 'rgba(0,0,0,0.3)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	darkText: {
		color: '#333',
		textShadowColor: 'transparent',
	},
	optionSelected: {
		borderWidth: 3,
		borderColor: '#007AFF',
	},
	finenessRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 16,
	},
	finenessOption: {
		width: 80,
		height: 80,
		borderRadius: 16,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	finenessText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
	},
	finenessLabel: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	clarityOption: {
		width: (width - 80) / 2,
		padding: 16,
		borderRadius: 16,
		backgroundColor: '#f0f0f0',
		alignItems: 'center',
	},
	clarityName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	clarityDesc: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	cutRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 12,
	},
	cutOption: {
		width: 70,
		height: 80,
		borderRadius: 16,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cutName: {
		fontSize: 10,
		color: '#666',
		marginTop: 6,
	},
	sizeGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
	},
	sizeOption: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	sizeText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	summaryCard: {
		backgroundColor: '#f8f8f8',
		borderRadius: 16,
		padding: 20,
		marginTop: 24,
		alignItems: 'center',
	},
	summaryTitle: {
		fontSize: 16,
		color: '#666',
	},
	summaryPrice: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#007AFF',
		marginVertical: 8,
	},
	summaryDetails: {
		alignItems: 'center',
		gap: 4,
	},
	summaryText: {
		fontSize: 14,
		color: '#666',
	},
	navButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
		backgroundColor: '#fff',
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButtonText: {
		fontSize: 16,
		color: '#333',
		marginLeft: 4,
	},
	backButtonPlaceholder: {
		flex: 1,
	},
	nextButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#007AFF',
		paddingHorizontal: 24,
		paddingVertical: 14,
		borderRadius: 12,
		gap: 8,
	},
	nextButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	tooltipModal: {
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 24,
		width: width - 60,
		alignItems: 'center',
	},
	tooltipTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333',
		marginBottom: 16,
	},
	tooltipContent: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
		lineHeight: 22,
		marginBottom: 20,
	},
	tooltipClose: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 12,
	},
	tooltipCloseText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
	optionSelectedText: {
		color: '#fff',
	},
})
