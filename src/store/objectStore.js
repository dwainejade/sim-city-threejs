import { create } from 'zustand';

export const useObjectStore = create((set) => ({
    objects: {
        road: {
            asphalt: { type: 'road', subtype: 'asphalt', cost: 10, available: true, color: '#202020', modelName: 'ROAD' },
            dirt: { type: 'road', subtype: 'dirt', cost: 1, available: true, color: '#774a3d', modelName: '' },
            // grass: { type: 'road', cost: 1, available: true, color: '#41980A', modelName: 'Shadow_Plane' },
        },
        building: {
            // house: { type: 'building', subtype: 'residential', cost: 100, available: true, color: 'limegreen', modelName: 'House' },
            apartment: { type: 'building', subtype: 'residential', cost: 300, available: true, color: 'darkgreen', modelName: 'House_2' },
            store: { type: 'building', subtype: 'commercial', cost: 500, available: true, color: 'blue', modelName: 'Shop' },
            // office: { type: 'building', subtype: 'commercial', cost: 1000, available: true, color: 'grey', modelName: 'Office' },
            // powerPlant: { type: 'building', subtype: 'industrial', cost: 5000, available: true, color: 'orange', modelName: 'PowerPlant' },
            // waterTower: { type: 'building', subtype: 'industrial', cost: 2000, available: true, color: 'dodgerblue', modelName: 'WaterTower' },
            // factory: { type: 'building', subtype: 'industrial', cost: 4000, available: true, color: 'brown', modelName: 'Factory' },
            // warehouse: { type: 'building', subtype: 'industrial', cost: 2000, available: true, color: '#767676', modelName: 'Warehouse' },
        },
        scenary: {
            tree: { type: 'scenary', subtype: 'tree', cost: 20, available: true, color: '#32CD32', modelName: 'Tree' },
            // park: { type: 'scenary', subtype: 'park', cost: 50, available: true, color: '#228B22', modelName: 'Trees' },
        },
    },
    addObject: (category, name, object) => set((state) => (
        {
            objects: {
                ...state.objects,
                [category]: {
                    ...state.objects[category],
                    [name]: object,
                },
            },
        })),
    removeObject: (category, name) => set((state) => {
        const newCategory = { ...state.objects[category] };
        delete newCategory[name];
        return {
            objects: {
                ...state.objects,
                [category]: newCategory,
            },
        };
    }),
}));