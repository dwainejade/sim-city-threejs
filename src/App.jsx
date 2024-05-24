import React from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from '@react-three/drei';
import Scene from "./components/Scene";
import Menu from "./components/ui/Menu";

const App = () => {
  return (
    <>
      <Canvas
        shadows dpr={[1, 2]}
        camera={{ position: [0, 100, 0], fov: 20, zoom: 3, near: 1, far: 100000 }}
        gl={{ logarithmicDepthBuffer: true }} >

        <Stats />
        <Scene />

      </Canvas>

      <Menu />
    </>
  );
};

export default App;
