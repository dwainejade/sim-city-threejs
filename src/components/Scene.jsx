import React from "react";
import { AccumulativeShadows, GizmoHelper, GizmoViewport, OrbitControls, RandomizedLight, Sky } from '@react-three/drei';
import Ground from "./Ground";
import Lights from "./Lights";

const Scene = () => {
    // const [time, setTime] = useState(0); // Initial time of day

    // const sunPosition = useRef([100, Math.sin(time) * 100, 100]);

    // useFrame((state, delta) => {
    //     setTime((prevTime) => (prevTime + delta * 0.1) % (2 * Math.PI)); // Speed of the cycle
    //     sunPosition.current = [100, Math.sin(time) * 100, 100];
    // });

    return (
        <>
            <OrbitControls
                maxDistance={200}
                minDistance={25}
                zoomSpeed={.3}
                panSpeed={.1}
                makeDefault
            />
            {/*TODO: add aix helper */}
            <axesHelper args={[2]} position={[0, 1, 0]} />

            <Lights />
            <Sky sunPosition={[100, 100, 100]} />
            <RandomizedLight castShadow amount={8} frames={130} position={[5, 5, -10]} />

            <Ground />
        </>
    );
};

export default Scene;