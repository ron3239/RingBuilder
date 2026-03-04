// components/3d/RingViewer.tsx
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import * as THREE from 'three'

const SERVER_URL = 'http://192.168.1.161:3000'

interface RingViewerProps {
	metalColor?: string
	stoneColor?: string
	autoRotate?: boolean
	onLoad?: () => void
	enableRotate?: boolean
}

function GLBRing({ metalColor, stoneColor }: { metalColor: string; stoneColor: string }) {
	const { scene } = useGLTF(`${SERVER_URL}/models/ring.glb`)
	const groupRef = useRef<THREE.Group>(null)

	const clonedScene = useMemo(() => {
		const cloned = scene.clone()
		cloned.traverse(child => {
			if (child instanceof THREE.Mesh) {
				console.log('🔍 Mesh name:', child.name)
				const name = child.name.toLowerCase()
				if (name.includes('stone') || name.includes('gem') || name.includes('diamond')) {
					child.material = new THREE.MeshStandardMaterial({
						color: stoneColor,
						metalness: 0.3,
						roughness: 0.1,
						emissive: stoneColor,
						emissiveIntensity: 0.15,
					})
				} else {
					child.material = new THREE.MeshStandardMaterial({
						color: metalColor,
						metalness: 0.9,
						roughness: 0.15,
					})
				}
			}
		})
		return cloned
	}, [scene, metalColor, stoneColor])

	return (
		<group ref={groupRef}>
			<primitive
				object={clonedScene}
				scale={0.7}
				position={[75, -15, 15]}
			/>
		</group>
	)
}

function FallbackRing({ metalColor, stoneColor }: { metalColor: string; stoneColor: string }) {
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
			<mesh
				position={[0, 0.4, 0]}
				rotation={[0.3, 0, 0]}
			>
				<octahedronGeometry args={[0.35, 0]} />
				<meshStandardMaterial
					color={stoneColor}
					metalness={0.3}
					roughness={0.1}
					emissive={stoneColor}
					emissiveIntensity={0.15}
				/>
			</mesh>
		</group>
	)
}

export default function RingViewer({
	metalColor = '#ffd700',
	stoneColor = '#ffffff',
	autoRotate = true,
	onLoad,
	enableRotate = false,
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
							stoneColor={stoneColor}
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
