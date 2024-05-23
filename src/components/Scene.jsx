import React from "react";
import { OrbitControls, Sky } from '@react-three/drei';
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
                // maxAzimuthAngle={Math.PI / 4}
                // maxPolarAngle={Math.PI / 2.5}
                maxDistance={10000}
                minDistance={15}
                zoomSpeed={1}
                enableRotate={false}
            />
            <Sky sunPosition={[100, 100, 100]} />
            <Lights />
            <Ground />
        </>
    );
};

export default Scene;