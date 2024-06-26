import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { aStar, getDirection, DIRECTIONS } from '../utils/aStar';

const Car = ({ waypoints, onArrival, carId, start, destination, color }) => {
    const [currentPath, setCurrentPath] = useState([]);
    const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
    const [position, setPosition] = useState([start.col + 0.5, 0, start.row + 0.5]);
    const [direction, setDirection] = useState(DIRECTIONS[0]); // Initialize with a default direction

    useEffect(() => {
        if (waypoints.length > 0) {
            const path = aStar(start, destination, waypoints);
            if (path.length > 0) {
                setCurrentPath(path);
                const startWaypoint = path[0];
                setPosition([startWaypoint.col + 0.5, 0, startWaypoint.row + 0.5]);
                if (path.length > 1) {
                    const nextWaypoint = path[1];
                    const newDirection = DIRECTIONS[nextWaypoint.dir] || DIRECTIONS[0]; // Fallback to default direction
                    setDirection(newDirection);
                }
            } else {
                console.warn(carId, "No path found from start to destination.");
            }
        }
    }, [waypoints]);

    useFrame((state, delta) => {
        if (currentPath.length > 0 && position) {
            const speed = 1;
            const deltaSpeed = speed * delta;
            const target = currentPath[currentWaypointIndex];
            const distance = Math.hypot((target.col + 0.5) - position[0], (target.row + 0.5) - position[2]);

            if (distance < 0.1) {
                if (currentWaypointIndex < currentPath.length - 1) {
                    const nextWaypoint = currentPath[currentWaypointIndex];
                    setCurrentWaypointIndex(currentWaypointIndex + 1);
                    const newDirection = DIRECTIONS[nextWaypoint.dir] || DIRECTIONS[0]; // Fallback to default direction
                    setDirection(newDirection);
                } else {
                    setDirection({ x: 0, z: 0, rotation: 0, offset: { x: 0, z: 0 } }); // Stop the car at the destination
                    onArrival(carId); // Call onArrival to remove the car
                }
            } else {
                setPosition((prev) => [
                    prev[0] + ((direction?.x || 0)) * deltaSpeed,
                    0,
                    prev[2] + ((direction?.z || 0)) * deltaSpeed
                ]);
            }
        }
    });

    return (
        <group position={[position[0] + direction.offset?.x, 0.1, position[2] + direction.offset?.z]} rotation={[0, direction.rotation, 0]}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.2, 0.1, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
};

export default Car;