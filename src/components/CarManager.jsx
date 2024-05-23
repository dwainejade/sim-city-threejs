import React, { useState, useEffect } from 'react';
import Car from './Car';
import { useGridStore } from '../store/gridStore';
import { getNeighboringRoadCell } from '../utils/helpers';

const CarManager = ({ waypoints }) => {
    const { cells, gridSize } = useGridStore();
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const houses = [];
        const stores = [];
        const newCars = [];

        // Identify houses and stores
        cells.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell.type === 'building' && cell.subtype === 'apartment') {
                    houses.push({ row: rowIndex, col: colIndex });
                } else if (cell.type === 'building' && cell.subtype === 'store') {
                    stores.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        // Generate cars
        houses.forEach((house) => {
            const startCell = getNeighboringRoadCell(house.row, house.col, cells);
            // console.log({ house, startCell });
            if (startCell) {
                const randomStore = stores[Math.floor(Math.random() * stores.length)];
                if (randomStore === undefined) return;
                const destinationCell = getNeighboringRoadCell(randomStore.row, randomStore.col, cells);
                if (destinationCell) {
                    newCars.push({ id: `${house.row}-${house.col}`, start: startCell, destination: destinationCell });
                }
            }
        });

        setCars(newCars);
    }, [cells]);

    return (
        <>
            {cars.map((car) => (
                <Car key={car.id} carId={car.id} start={car.start} destination={car.destination} waypoints={waypoints} color='orange' />
            ))}
        </>
    );
};

export default CarManager;