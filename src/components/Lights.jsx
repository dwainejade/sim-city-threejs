import React from 'react';

const Lights = () => {
    // const dayIntensity = Math.max(0.1, Math.sin(time) * 1.5);
    // const nightIntensity = 1 - dayIntensity;

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight
                position={[50, 100, -100]}
                intensity={2}
                color="#ffffff"
                castShadow
                shadow-mapSize={[512, 512]}
                // shadow-camera-near={.1}
                // shadow-camera-far={10000}
                // shadow-camera-top={1000}
                // shadow-camera-right={1000}
                shadow-camera-bottom={-10}
                shadow-camera-left={-10}
            />
            <directionalLight
                position={[0, 100, 100]}
                intensity={2}
                color="#fdfbd3"
            />
        </>
    );
};

export default Lights;