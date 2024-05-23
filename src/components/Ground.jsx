import React, { useEffect, useMemo, useState } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useGridStore } from '../store/gridStore';
import { useObjectStore } from '../store/objectStore';
import { Apartment, Shop, Trees, Road2 } from './objects/CityPack';
import CarManager from './CarManager';

const Grid = () => {
    const { gridSize, cells, initializeGrid, selectedCells, setSelectedCells, placeObject, clearCell, roads, waypoints } = useGridStore();
    const { objects } = useObjectStore();
    const [dragging, setDragging] = useState(false);
    const [startCell, setStartCell] = useState(null);
    const [endCell, setEndCell] = useState(null);
    const { raycaster, pointer, scene, camera } = useThree();

    useEffect(() => {
        if (!cells.length) initializeGrid(gridSize);
    }, [gridSize, initializeGrid]);

    // useEffect(() => {
    //     generateWaypoints();
    // }, [roads]);

    // const generateWaypoints = () => {
    //     const waypointSet = new Set();

    //     roads.forEach(({ row, col }) => {
    //         if (isIntersection(row, col)) {
    //             waypointSet.add(`${row},${col}`);
    //         }
    //     });

    //     const waypointsArray = Array.from(waypointSet).map(str => {
    //         const [row, col] = str.split(',').map(Number);
    //         return { row, col };
    //     });

    //     setWaypoints(waypointsArray);
    // };

    const isIntersection = (row, col) => {
        const neighbors = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 }
        ];

        let roadCount = 0;
        neighbors.forEach(({ row, col }) => {
            if (roads.some(road => road.row === row && road.col === col)) {
                roadCount++;
            }
        });

        return roadCount >= 2;
    };

    const instances = useMemo(() => {
        if (cells.length === 0) return [];
        const instancesArray = [];
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
            for (let colIndex = 0; colIndex < gridSize; colIndex++) {
                const cell = cells[rowIndex][colIndex];
                instancesArray.push({
                    position: [colIndex, 0, rowIndex],
                    rowIndex,
                    colIndex,
                    rotation: cell.rotation || 0,
                    type: cell.type,
                    subtype: cell.subtype,
                });
            }
        }
        return instancesArray;
    }, [gridSize, cells]);

    const handlePointerDown = (e) => {
        if (e.button !== 0) return; // Only proceed for left mouse button
        e.stopPropagation();
        const { rowIndex, colIndex } = getIntersectedCell(e);
        if (rowIndex !== null && colIndex !== null) {
            setDragging(true);
            setStartCell({ rowIndex, colIndex });
            setSelectedCells([{ rowIndex, colIndex }]);
        }
    };

    const handlePointerMove = (e) => {
        if (!dragging || !startCell) return;
        const { rowIndex, colIndex } = getIntersectedCell(e);
        if (rowIndex !== endCell?.rowIndex || colIndex !== endCell?.colIndex) {
            setEndCell({ rowIndex, colIndex });
            calculateSelectedCells(startCell, { rowIndex, colIndex });
        }
    };

    const handlePointerUp = (e) => {
        if (e.button !== 0) return; // Only proceed for left mouse button
        e.stopPropagation();
        setDragging(false);
        const { rowIndex, colIndex } = getIntersectedCell(e);
        if (rowIndex !== null && colIndex !== null) {
            setEndCell({ rowIndex, colIndex });
            calculateSelectedCells(startCell, { rowIndex, colIndex });
        }
    };

    const getIntersectedCell = (e) => {
        pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            const { x, z } = intersect.point;
            const rowIndex = Math.floor(z);
            const colIndex = Math.floor(x);
            // Check boundaries
            if (rowIndex >= 0 && rowIndex < gridSize && colIndex >= 0 && colIndex < gridSize) {
                return { rowIndex, colIndex };
            }
        }
        return { rowIndex: null, colIndex: null };
    };

    const calculateSelectedCells = (start, end) => {
        if (!start || !end) return;
        const { rowIndex: startRow, colIndex: startCol } = start;
        const { rowIndex: endRow, colIndex: endCol } = end;
        const minRow = Math.max(Math.min(startRow, endRow), 0);
        const maxRow = Math.min(Math.max(startRow, endRow), gridSize - 1);
        const minCol = Math.max(Math.min(startCol, endCol), 0);
        const maxCol = Math.min(Math.max(startCol, endCol), gridSize - 1);
        const cells = [];
        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                cells.push({ rowIndex: row, colIndex: col });
            }
        }
        setSelectedCells(cells);
    };

    const handlePlaceObject = (category, name) => {
        placeObject(category, name, objects);
    };

    const handleRemoveObject = () => {
        selectedCells.forEach(({ rowIndex, colIndex }) => {
            clearCell(rowIndex, colIndex);
        });
        setSelectedCells([]); // Clear selected cells after removing objects
    };

    return (
        <group
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* Render the base grid */}
            <Instances limit={gridSize * gridSize} position={[0, -0.501, 0]} receiveShadow >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#41980A" />
                {instances.map((instance, index) => (
                    <Instance
                        key={index}
                        position={instance.position}
                    />
                ))}
            </Instances>

            {/* Highlight the selected cells */}
            {selectedCells.map((cell, index) => (
                <mesh key={index} position={[cell.colIndex, 0.01, cell.rowIndex]}>
                    <boxGeometry args={[1, 0.01, 1]} />
                    <meshStandardMaterial color="yellow" emissive={'yellow'} transparent opacity={0.8} />
                </mesh>
            ))}

            {/* Render objects above the grid */}
            {instances.map((instance, index) => {
                if (instance.subtype === 'apartment') {
                    return (
                        <Apartment key={index} index={index} position={[instance.position[0], 0, instance.position[2]]} rotation-y={instance.rotation * Math.PI / 180} />
                    );
                }
                if (instance.subtype === 'store') {
                    return (
                        <Shop key={index} index={index} position={[instance.position[0], 0, instance.position[2]]} rotation-y={instance.rotation * Math.PI / 180} />
                    );
                }
                if (instance.type === 'road') {
                    return (
                        <Road2 key={index} index={index} position={[instance.position[0], 0, instance.position[2]]} rotation-y={instance.rotation * Math.PI / 180} />
                    );
                }
                if (instance.subtype === 'tree') {
                    return (
                        <Trees key={index} index={index} position={[instance.position[0], 0, instance.position[2]]} rotation-y={instance.rotation * Math.PI / 180} />
                    );
                }
                return null;
            })}

            {/* Render waypoints */}
            {waypoints.map((waypoint, index) => (
                <mesh key={index} position={[waypoint.col, 0.01, waypoint.row]}>
                    <boxGeometry args={[.05, .001, .05]} />
                    <meshStandardMaterial color="#f4f4f4" />
                </mesh>
            ))}

            {/* Render cars */}
            <CarManager waypoints={waypoints} />
        </group>
    );
};

export default Grid;