import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { aStar } from './AStar'; // Import the A* algorithm

const DIRECTIONS = [
    { x: 0, z: -1, rotation: 0 }, // North
    { x: 1, z: 0, rotation: Math.PI / 2 },  // East
    { x: 0, z: 1, rotation: Math.PI },  // South
    { x: -1, z: 0, rotation: -Math.PI / 2 }  // West
];

const start = { row: 0, col: 9 };
const destination = { row: 8, col: 6 };

const Car = ({ waypoints }) => {
    const { nodes } = useGLTF('/models/City_Pack.gltf');
    const [currentPath, setCurrentPath] = useState([]);
    const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
    const [position, setPosition] = useState([0, 0, 0]);
    const [direction, setDirection] = useState({ x: 0, z: 0, rotation: 0 });


    useEffect(() => {
        if (waypoints.length > 0) {
            const path = aStar(start, destination, waypoints);
            if (path.length > 0) {
                console.log("Path found:", path);
                setCurrentPath(path);
                const startWaypoint = path[0];
                setPosition([startWaypoint.col, 0, startWaypoint.row]);
                if (path.length > 1) {
                    const nextWaypoint = path[1];
                    const newDirection = DIRECTIONS[nextWaypoint.dir];
                    setDirection(newDirection);
                }
            } else {
                console.error("No path found from start to destination.");
            }
        }
    }, [waypoints]);

    useFrame(() => {
        if (currentPath.length > 0 && position) {
            const target = currentPath[currentWaypointIndex];
            const distance = Math.hypot(target.col - position[0], target.row - position[2]);

            if (distance < 0.01) { // Reduce threshold for better smoothness
                if (currentWaypointIndex < currentPath.length - 1) {
                    const nextWaypoint = currentPath[currentWaypointIndex];
                    setCurrentWaypointIndex(currentWaypointIndex + 1);
                    const newDirection = DIRECTIONS[nextWaypoint.dir];
                    setDirection(newDirection);
                } else {
                    // console.log("Reached destination:", target);
                    setDirection({ x: 0, z: 0, rotation: 0 }); // Stop the car at the destination
                }
            } else {
                const speed = 0.01;
                setPosition((prev) => [
                    prev[0] + (direction?.x || 0) * speed,
                    0,
                    prev[2] + (direction?.z || 0) * speed
                ]);
            }
        }
    });

    return (
        <group position={position} rotation={[0, 0, 0]} args={[1, 1, 1]}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[.2, .2, .2]} />
                <meshStandardMaterial color={'orangered'} />
            </mesh>
        </group>
    );
};

export default Car;