import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useTimerStore, formatTime, SessionType } from '../stores/timerStore';

const AnimatedGroup = animated('group');

// Session colors
const SESSION_COLORS: Record<SessionType | 'settings', string> = {
  'focus': '#ef4444',
  'short_break': '#22c55e',
  'long_break': '#3b82f6',
  'settings': '#a855f7',
};

// Progress Circle Component
function ProgressCircle({ 
  progress, 
  color, 
  isRunning 
}: { 
  progress: number; 
  color: string; 
  isRunning: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current && isRunning) {
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      material.opacity = pulse;
    }
    if (glowRef.current && isRunning) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.3;
      material.opacity = pulse;
    }
  });

  const thetaLength = progress * Math.PI * 2;
  
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Background track */}
      <mesh position={[0, 0, 0.001]}>
        <ringGeometry args={[0.56, 0.66, 128]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Progress glow (soft outer) */}
      <mesh ref={glowRef} position={[0, 0, 0.002]}>
        <ringGeometry args={[0.54, 0.68, 128, 1, 0, thetaLength]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Progress arc (main) */}
      <mesh ref={ringRef} position={[0, 0, 0.003]}>
        <ringGeometry args={[0.57, 0.65, 128, 1, 0, thetaLength]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}


// Face display component - only active face shows content
function FaceDisplay({ 
  position, 
  rotation, 
  time, 
  isActive,
  sessionType,
  isRunning,
  progress,
  onToggle
}: { 
  position: [number, number, number];
  rotation: [number, number, number];
  time: string;
  isActive: boolean;
  sessionType: SessionType | 'settings';
  isRunning: boolean;
  progress: number;
  onToggle: () => void;
}) {
  const activeColor = SESSION_COLORS[sessionType];
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current && isActive && isRunning) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.03 + 1;
      textRef.current.scale.setScalar(pulse);
    } else if (textRef.current) {
      textRef.current.scale.setScalar(1);
    }
  });

  const showProgress = sessionType !== 'settings';

  // Handle click on timer numbers
  const handleTimerClick = () => {
    if (sessionType !== 'settings') {
      onToggle();
    }
  };

  // Only render content on active face for cleaner look
  if (!isActive) {
    return (
      <group position={position} rotation={rotation}>
        {/* Subtle inactive indicator */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.12, 32]} />
          <meshBasicMaterial 
            color={activeColor} 
            transparent 
            opacity={0.2}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Progress circle */}
      {showProgress && (
        <group position={[0, 0, 0.01]}>
          <ProgressCircle 
            progress={progress}
            color={activeColor}
            isRunning={isRunning}
          />
        </group>
      )}

      {/* Clickable hit area for play/pause */}
      {sessionType !== 'settings' && (
        <mesh position={[0, 0, 0.015]} onClick={handleTimerClick}>
          <planeGeometry args={[1.4, 0.8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Time display */}
      <group ref={textRef}>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.42}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {time}
        </Text>
      </group>
    </group>
  );
}

export function PomodoroCube() {
  const meshRef = useRef<THREE.Group>(null);
  
  const { 
    currentFace, 
    timeRemaining,
    totalDuration,
    config,
    state,
    toggle
  } = useTimerStore();

  const isRunning = state === 'running';
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 1;

  // Target rotation - each face rotates to face the camera directly
  const targetRotation = useMemo(() => {
    const rotations: Record<number, number> = {
      0: 0,
      1: -Math.PI / 2,
      2: Math.PI,
      3: Math.PI / 2,
    };
    return rotations[currentFace] || 0;
  }, [currentFace]);

  // Smooth spring animation
  const { rotationY } = useSpring({
    rotationY: targetRotation,
    config: { mass: 1, tension: 120, friction: 20 },
  });


  // Format times
  const times = {
    focus: formatTime(currentFace === 0 ? timeRemaining : config.focusMinutes * 60),
    shortBreak: formatTime(currentFace === 1 ? timeRemaining : config.shortBreakMinutes * 60),
    longBreak: formatTime(currentFace === 2 ? timeRemaining : config.longBreakMinutes * 60),
    settings: '⚙',
  };

  const currentColor = useMemo(() => {
    const sessionType = currentFace === 0 ? 'focus' 
      : currentFace === 1 ? 'short_break' 
      : currentFace === 2 ? 'long_break' 
      : 'settings';
    return SESSION_COLORS[sessionType];
  }, [currentFace]);

  return (
    <>
      {/* Soft lighting setup */}
      <ambientLight intensity={0.5} />
      
      {/* Key light - top right */}
      <directionalLight
        position={[3, 4, 5]}
        intensity={0.7}
        color="#ffffff"
      />
      
      {/* Fill light - left */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={0.4}
        color="#ffffff"
      />
      
      {/* Rim light - back */}
      <directionalLight
        position={[0, 2, -3]}
        intensity={0.3}
        color="#ffffff"
      />

      {/* Accent light when running */}
      {isRunning && (
        <pointLight
          position={[0, 0, 2.5]}
          color={currentColor}
          intensity={0.8}
          distance={4}
        />
      )}

      {/* Cube with tilt to show top and right side */}
      <group rotation={[0.25, -0.25, 0]}>
        <AnimatedGroup 
          ref={meshRef} 
          rotation-y={rotationY}
        >
          {/* Main cube body */}
          <RoundedBox
            args={[2, 2, 2]}
            radius={0.18}
            smoothness={8}
          >
            <meshStandardMaterial
              color="#141414"
              metalness={0.1}
              roughness={0.9}
            />
          </RoundedBox>

          {/* Front face - Focus */}
          <FaceDisplay
            position={[0, 0, 1.01]}
            rotation={[0, 0, 0]}
            time={times.focus}
            isActive={currentFace === 0}
            sessionType="focus"
            isRunning={isRunning && currentFace === 0}
            progress={currentFace === 0 ? progress : 1}
            onToggle={toggle}
          />

          {/* Right face - Short Break */}
          <FaceDisplay
            position={[1.01, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            time={times.shortBreak}
            isActive={currentFace === 1}
            sessionType="short_break"
            isRunning={isRunning && currentFace === 1}
            progress={currentFace === 1 ? progress : 1}
            onToggle={toggle}
          />

          {/* Back face - Long Break */}
          <FaceDisplay
            position={[0, 0, -1.01]}
            rotation={[0, Math.PI, 0]}
            time={times.longBreak}
            isActive={currentFace === 2}
            sessionType="long_break"
            isRunning={isRunning && currentFace === 2}
            progress={currentFace === 2 ? progress : 1}
            onToggle={toggle}
          />

          {/* Left face - Settings */}
          <FaceDisplay
            position={[-1.01, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            time={times.settings}
            isActive={currentFace === 3}
            sessionType="settings"
            isRunning={false}
            progress={1}
            onToggle={toggle}
          />

        </AnimatedGroup>
      </group>
    </>
  );
}

export { PomodoroCube as PomodoroСube };
