import React, { useState, useEffect, useRef } from 'react';
import Car from './Car';
import { useGridStore } from '../store/gridStore';
import { getNeighboringRoadCell } from '../utils/helpers';

const MAX_CARS = 1;
const CARS_PER_APARTMENT = 2;
const CAR_RETURN_DELAY = 1000; // Time in milliseconds before the car returns

const CAR_COLORS = [
    '#fca60c', '#bb439a', '#c0dded', '#08a8e5', '#79ce5b', '#755d56', '#fcd413', '#a4a6ca', '#8e23b6', '#ee2265',
    '#1fd1dc', '#1a5d31', '#331f94', '#e2785e', '#f7401d', '#244eb4', '#74a76b', '#116864', '#e7a69b', '#5c3830',
    '#660ea0', '#fce186', '#138486', '#f090c8', '#5f8094', '#fcf35c', '#5c64c4', '#af4bc4', '#04a6a6', '#a3044c',
    '#fc7804', '#ab73d3', '#da66cb', '#33a32b', '#d31b1a', '#0474d4', '#fc534c', '#fb5c14', '#3f3cac', '#44b42c',
    '#3c3a3a'
];

const getRandomColor = () => {
    return CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
};

const CarManager = ({ waypoints }) => {
    const { cells } = useGridStore();
    const [cars, setCars] = useState([]);
    const apartments = useRef([]);
    const stores = useRef([]);
    const carSpawnInterval = useRef(null);

    const carCounts = useRef({}); // Keeps track of the number of cars per apartment

    useEffect(() => {
        const newApartments = [];
        const newStores = [];

        cells.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell.type === 'building' && cell.subtype === 'apartment') {
                    newApartments.push({ row: rowIndex, col: colIndex });
                } else if (cell.type === 'building' && cell.subtype === 'store') {
                    newStores.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        apartments.current = newApartments;
        stores.current = newStores;
    }, [cells]);

    useEffect(() => {
        carSpawnInterval.current = setInterval(spawnCar, 500); // Try to spawn a car every second
        return () => clearInterval(carSpawnInterval.current);
    }, []);

    const spawnCar = () => {
        if (cars.length >= MAX_CARS || apartments.current.length === 0 || stores.current.length === 0) return;

        const randomApartment = apartments.current[Math.floor(Math.random() * apartments.current.length)];
        const apartmentKey = `${randomApartment.row}-${randomApartment.col}`;

        if (!carCounts.current[apartmentKey]) {
            carCounts.current[apartmentKey] = 0;
        }

        if (carCounts.current[apartmentKey] >= CARS_PER_APARTMENT) return;

        const startCell = getNeighboringRoadCell(randomApartment.row, randomApartment.col, cells);
        if (!startCell) return;

        const randomStore = stores.current[Math.floor(Math.random() * stores.current.length)];
        if (randomStore === undefined) return;

        const destinationCell = getNeighboringRoadCell(randomStore.row, randomStore.col, cells);
        if (!destinationCell) return;

        const carId = `${randomApartment.row}-${randomApartment.col}-${Date.now()}`;
        const carColor = getRandomColor();
        setCars((prevCars) => [...prevCars, { id: carId, start: startCell, destination: destinationCell, color: carColor }]);
        carCounts.current[apartmentKey] += 1;
    };

    const handleCarArrival = (carId) => {
        setTimeout(() => {
            setCars((prevCars) => {
                const carToRemove = prevCars.find((car) => car.id === carId);
                if (carToRemove) {
                    const apartmentKey = `${carToRemove.start.row}-${carToRemove.start.col}`;
                    carCounts.current[apartmentKey] -= 1;
                }
                return prevCars.filter((car) => car.id !== carId);
            });
        }, CAR_RETURN_DELAY);
    };

    return (
        <>
            {cars.map((car) => (
                <Car
                    key={car.id}
                    carId={car.id}
                    start={car.start}
                    destination={car.destination}
                    waypoints={waypoints}
                    onArrival={handleCarArrival}
                    color={car.color}
                />
            ))}
        </>
    );
};

export default CarManager;