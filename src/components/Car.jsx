import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { aStar } from './AStar'; // Import the A* algorithm

const DIRECTIONS = [
    { x: 0, z: -1, rotation: 0 }, // North
    { x: 1, z: 0, rotation: Math.PI / 2 },  // East
    { x: 0, z: 1, rotation: Math.PI },  // South
    { x: -1, z: 0, rotation: -Math.PI / 2 }  // West
];

const Car = ({ carId, start, destination, waypoints, color = 'orangered' }) => {
    const [currentPath, setCurrentPath] = useState([]);
    const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
    const [position, setPosition] = useState([start.col, 0, start.row]);
    const [direction, setDirection] = useState({ x: 0, z: 0, rotation: 0 });

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
    }, [start, destination]);

    useFrame((state, delta) => {
        if (currentPath.length > 0 && position) {
            const target = currentPath[currentWaypointIndex];
            const distance = Math.hypot(target.col - position[0], target.row - position[2]);
            const speed = .8;
            const deltaSpeed = delta * speed;
            if (distance < 0.1) {
                if (currentWaypointIndex < currentPath.length - 1) {
                    const nextWaypoint = currentPath[currentWaypointIndex];
                    setCurrentWaypointIndex(currentWaypointIndex + 1);
                    const newDirection = DIRECTIONS[nextWaypoint.dir];
                    setDirection(newDirection);
                } else {
                    setDirection({ x: 0, z: 0, rotation: 0 });
                    setCurrentPath([]); // Clear path to stop the car
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

    // Render the car only if there's a path to follow
    return currentPath.length > 0 ? (
        <group position={position} >
            <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[.2, .15, .2]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    ) : null;
};

export default Car;