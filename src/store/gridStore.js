import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useGridStore = create(persist(
    (set, get) => ({
        gridSize: 10,
        cells: [],
        roads: [],
        waypoints: [],
        selectedCell: null,
        selectedCells: [],
        rotation: 0,
        initializeGrid: (size) => set(() => {
            const newCells = Array(size).fill().map(() => Array(size).fill().map(() => ({ type: 'empty', color: '#41980A' })));
            return { cells: newCells };
        }),
        setCellProperty: (row, col, property) => set((state) => {
            const newCells = state.cells.map((rowArr, rowIndex) =>
                rowArr.map((cell, colIndex) =>
                    rowIndex === row && colIndex === col ? { ...cell, ...property } : cell
                )
            );
            return { cells: newCells };
        }),
        setSelectedCell: (rowIndex, colIndex) => set({ selectedCell: { rowIndex, colIndex } }),
        setSelectedCells: (cells) => set({ selectedCells: cells }),
        placeObject: (category, name, objects) => {
            const selectedCells = get().selectedCells;
            selectedCells.forEach(({ rowIndex, colIndex }) => {
                const object = objects[category][name];
                if (object && object.available) {
                    get().setCellProperty(rowIndex, colIndex, { type: category, subtype: name, rotation: get().rotation });
                    if (category === 'road') {
                        get().addRoad(rowIndex, colIndex);
                    }
                }
            });
            set({ selectedCells: [] });
        },
        addRoad: (row, col) => set((state) => {
            const newRoads = [...state.roads, { row, col }];
            get().generateWaypoints(newRoads);
            return { roads: newRoads };
        }),
        clearCell: (row, col) => {
            set((state) => {
                const newCells = state.cells.map((rowArr, rowIndex) =>
                    rowArr.map((cell, colIndex) =>
                        rowIndex === row && colIndex === col ? { type: 'empty', color: '#41980A' } : cell
                    )
                );
                const newRoads = state.roads.filter(road => road.row !== row || road.col !== col);
                get().generateWaypoints(newRoads);
                return { cells: newCells, roads: newRoads };
            });
        },
        rotateObject: (rowIndex, colIndex) => set((state) => {
            const newCells = state.cells.slice();
            const cell = newCells[rowIndex][colIndex];
            cell.rotation = (cell.rotation + 90) % 360;
            return { cells: newCells };
        }),
        generateWaypoints: (roads) => {
            const waypoints = {};

            roads.forEach(({ row, col }) => {
                const key = `${row},${col}`;
                waypoints[key] = waypoints[key] || { row, col, neighbors: [] };

                const neighbors = [
                    { row: row - 1, col, dir: 0 }, // North
                    { row: row + 1, col, dir: 2 }, // South
                    { row, col: col - 1, dir: 3 }, // West
                    { row, col: col + 1, dir: 1 }  // East
                ];

                neighbors.forEach(({ row: nRow, col: nCol, dir }) => {
                    if (roads.some(road => road.row === nRow && road.col === nCol)) {
                        // check for duplicates in neighbors array
                        if (!waypoints[key].neighbors.some(wp => wp.row === nRow && wp.col === nCol))
                            waypoints[key].neighbors.push({ row: nRow, col: nCol, dir });
                    }
                });
            });

            set({ waypoints: Object.values(waypoints) });
        },
        isIntersection: (row, col, roads) => {
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
        }
    }),
    {
        name: 'grid-storage',
        storage: createJSONStorage(() => localStorage),
    }
));