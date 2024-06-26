import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { aStar } from './AStar'; // Import the A* algorithm
import { useGLTF } from '@react-three/drei';

const DIRECTIONS = [
    { x: 0, z: -1, rotation: 0, offset: { x: 0.3, z: 0 } }, // North
    { x: 1, z: 0, rotation: -Math.PI / 2, offset: { x: 0, z: 0.3 } },  // East
    { x: 0, z: 1, rotation: Math.PI, offset: { x: -0.3, z: 0 } },  // South
    { x: -1, z: 0, rotation: Math.PI / 2, offset: { x: 0, z: -0.3 } }  // West
];

const MAX_TRAVEL_TIME = 15000; // 30 seconds

export const Car = ({ carId, start, destination, waypoints, color = 'orangered', onMiss }) => {
    const { nodes, materials } = useGLTF('/models/City_Pack.gltf');
    const [carModel, setCarModel] = useState("CAR_03");
    const carTypes = [
        "CAR_03",
        "CAR_03_1",
        "CAR_03_1_2",
        "CAR_03_2_2",
        "Car_04_2_2",
        "CAR_03_2",
        "CAR_03_3",
        "CAR_03_2_3",
        "Car_04",
        "Car_04_1",
        "Car_04_1_2",
        "Car_04_2",
        "Car_04_3",
        "Car_04_4",
    ];
    const [carOpacity, setCarOpacity] = useState(0);

    const randomCarType = carTypes[Math.floor(Math.random() * carTypes.length)];

    const [currentPath, setCurrentPath] = useState([]);
    const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
    const [position, setPosition] = useState([start.col, 0, start.row]);
    const [direction, setDirection] = useState({ x: 0, z: 0, rotation: 0, offset: { x: 0, z: 0 } });
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        const path = aStar(start, destination, waypoints);
        if (path.length > 0) {
            setCurrentPath(path);
            if (path.length > 1) {
                const nextWaypoint = path[1];
                const newDirection = DIRECTIONS[nextWaypoint.dir];
                setDirection(newDirection);
            }
        } else {
            console.warn("No path found from start to destination.");
        }
        setCarModel(randomCarType);
        setStartTime(Date.now());
    }, [start, destination]);

    useFrame((state, delta) => {
        if (currentPath.length > 0 && position) {
            const target = currentPath[currentWaypointIndex];
            const distance = Math.hypot(target.col - position[0], target.row - position[2]);
            const speed = 1;
            const deltaSpeed = delta * speed;

            // Check if car has taken too long
            if (Date.now() - startTime > MAX_TRAVEL_TIME) {
                console.warn(`Car ${carId} missed its destination: took too long`);
                if (onMiss) onMiss(carId);
                setCurrentPath([]);
                return;
            }

            // Check if car is significantly off path
            if (distance > 2) {
                console.log(distance)
                console.warn(`Car ${carId} missed its destination: deviated from path`);
                if (onMiss) onMiss(carId);
                setCurrentPath([]);
                return;
            }

            if (distance < 0.1) {
                if (currentWaypointIndex < currentPath.length - 1) {
                    const nextWaypoint = currentPath[currentWaypointIndex];
                    setCurrentWaypointIndex(currentWaypointIndex + 1);
                    const newDirection = DIRECTIONS[nextWaypoint.dir];
                    setDirection(newDirection);
                } else {
                    setDirection({ x: 0, z: 0, rotation: 0, offset: currentPath[currentWaypointIndex].offset });
                    setCurrentPath([]);
                }
            } else {
                setPosition((prev) => [
                    prev[0] + (direction?.x || 0) * deltaSpeed,
                    0,
                    prev[2] + (direction?.z || 0) * deltaSpeed
                ]);
            }
        }
    });

    return currentPath.length > 0 && direction ? (
        <group position={[position[0], 0, position[2]]} rotation={[0, direction.rotation, 0]} >
            <mesh
                name="Car"
                castShadow
                geometry={nodes[carModel]?.geometry}
                material={materials['World ap']}
                scale={.002}
                position={[0.3, 0.07, 0]}
                transparent
                opacity={carOpacity}
            />
        </group>
    ) : null;
};

export default Car;