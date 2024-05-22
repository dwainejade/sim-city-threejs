import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useGridStore = create(persist(
    (set, get) => ({
        gridSize: 10,
        cells: [],
        selectedCell: null,
        selectedCells: [],
        rotation: 0, // Add rotation state
        initializeGrid: (size) => set(() => {
            const newCells = Array(size).fill().map(() =>
                Array(size).fill().map(() => ({ type: 'empty', color: '#41980A', rotation: 0 }))
            );
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
            const { selectedCells, rotation } = get();
            selectedCells.forEach(({ rowIndex, colIndex }) => {
                const object = objects[category][name];
                if (object && object.available) {
                    get().setCellProperty(rowIndex, colIndex, { type: category, subtype: name, color: object.color, rotation });
                }
            });
            set({ selectedCells: [] }); // Clear selected cells after placing objects
        },
        clearCell: (row, col) => {
            set((state) => {
                const newCells = state.cells.map((rowArr, rowIndex) =>
                    rowArr.map((cell, colIndex) =>
                        rowIndex === row && colIndex === col ? { type: 'empty', color: '#41980A', rotation: 0 } : cell
                    )
                );
                return { cells: newCells };
            });
        },
        rotateObject: (rowIndex, colIndex) => set((state) => {
            const newCells = state.cells.slice();
            const cell = newCells[rowIndex][colIndex];
            cell.rotation = (cell.rotation + 90) % 360;
            return { cells: newCells };
        }),
    }),
    {
        name: 'grid-storage',
        storage: createJSONStorage(() => localStorage),
    }
));