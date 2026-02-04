import { Object3DNode } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedBox: Object3DNode<typeof RoundedBox, typeof RoundedBox>;
  }
}
