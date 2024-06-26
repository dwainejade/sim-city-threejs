import React from "react";
import { Canvas } from "@react-three/fiber";
import { Bvh, PerformanceMonitor, Stats } from '@react-three/drei';
import Scene from "./components/Scene";
import Menu from "./components/ui/Menu";
import { Perf } from "r3f-perf";

const App = () => {
  const [dpr, setDpr] = React.useState(1);

  return (
    <>
      <Canvas
        shadows dpr={dpr}
        camera={{ position: [60, 80, 130], fov: 50, zoom: 10, near: 1, far: 1000 }}
        gl={{ antialias: true }} >

        <Perf position="top-left" deepAnalyze />
        <Bvh firstHitOnly>
          <Scene />
        </Bvh>

        <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />

      </Canvas>

      <Menu />
    </>
  );
};

export default App;
