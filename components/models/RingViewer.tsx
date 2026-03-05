// components/3d/RingViewer.tsx
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import * as THREE from 'three'

const SERVER_URL = 'http://192.168.1.161:3000'

interface RingViewerProps {
	metalColor?: string
	autoRotate?: boolean
	onLoad?: () => void
	enableRotate?: boolean
	modelName?: string
}

const MODEL_CONFIG: Record<
	string,
	{ scale: number; position: [number, number, number]; rotation?: [number, number, number] }
> = {
	ring: { scale: 0.7, position: [75, -15, 15], rotation: [0, 0, 0] },
	david_star: { scale: 0.5, position: [-1, 0, -1], rotation: [5, 0, 10] },
	ogerel: { scale: 0.1, position: [0.4, 0, -0.5], rotation: [0, 0, Math.PI / 2] },
}

function GLBRing({ metalColor, modelName = 'ring' }: { metalColor: string; modelName?: string }) {
	const { scene } = useGLTF(`${SERVER_URL}/models/${modelName}.glb`)
	const groupRef = useRef<THREE.Group>(null)
	const config = MODEL_CONFIG[modelName] || MODEL_CONFIG.ring

	useEffect(() => {
		scene.traverse(child => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh
				const newMaterial = new THREE.MeshStandardMaterial({
					color: metalColor,
					metalness: 0.9,
					roughness: 0.15,
				})
				mesh.material = newMaterial
			}
		})
	}, [metalColor])

	return (
		<group ref={groupRef}>
			<primitive
				object={scene}
				scale={config.scale}
				position={config.position}
				rotation={config.rotation}
			/>
		</group>
	)
}

function FallbackRing({ metalColor }: { metalColor: string }) {
	const groupRef = useRef<THREE.Group>(null)

	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.y += 0.008
		}
	})

	return (
		<group ref={groupRef}>
			<mesh rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[1.5, 0.3, 16, 100]} />
				<meshStandardMaterial
					color={metalColor}
					metalness={0.9}
					roughness={0.15}
				/>
			</mesh>
		</group>
	)
}

export default function RingViewer({
	metalColor = '#ffd700',
	autoRotate = true,
	onLoad,
	enableRotate = false,
	modelName = 'ring',
}: RingViewerProps) {
	const [loading, setLoading] = useState(true)
	const orbitRef = useRef<any>(null)
	let timeoutRef: ReturnType<typeof setTimeout> | null = null

	const handleControlEnd = () => {
		if (timeoutRef) clearTimeout(timeoutRef)
		timeoutRef = setTimeout(() => {
			if (orbitRef.current) {
				console.log('📷 Camera angle:', {
					azimuth: orbitRef.current.getAzimuthalAngle(),
					polar: orbitRef.current.getPolarAngle(),
				})
			}
		}, 300)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false)
			if (onLoad) onLoad()
		}, 1500)

		return () => clearTimeout(timer)
	}, [])

	// ===== НАСТРОЙКИ КАМЕРЫ =====
	// camera.position [x, y, z] - позиция камеры
	// camera.fov - угол обзора (меньше = больше зум)

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.loading}>
					<ActivityIndicator
						size='large'
						color='#007AFF'
					/>
					<Text style={styles.loadingText}>Загрузка 3D модели...</Text>
				</View>
			) : (
				<Canvas
					style={styles.canvas}
					camera={{ position: [-2.7, 0.58, -1.18], fov: 50 }}
					onCreated={({ camera }) => {
						camera.lookAt(75, -15, 15)
					}}
				>
					{enableRotate && (
						<OrbitControls
							ref={orbitRef}
							onStart={() => {
								orbitRef.current?.addEventListener('change', handleControlEnd)
							}}
						/>
					)}
					<color
						attach='background'
						args={['#e8e8e8']}
					/>
					<ambientLight intensity={0.6} />
					<directionalLight
						position={[5, 10, 7]}
						intensity={1.2}
					/>
					<directionalLight
						position={[-5, 5, -5]}
						intensity={0.6}
					/>
					<pointLight
						position={[0, 3, 3]}
						intensity={0.5}
					/>

					<Suspense fallback={null}>
						<GLBRing
							metalColor={metalColor}
							modelName={modelName}
						/>
					</Suspense>
				</Canvas>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		backgroundColor: '#e8e8e8',
	},
	canvas: {
		flex: 1,
		backgroundColor: '#e8e8e8',
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#e8e8e8',
	},
	loadingText: {
		marginTop: 10,
		color: '#666',
	},
})
