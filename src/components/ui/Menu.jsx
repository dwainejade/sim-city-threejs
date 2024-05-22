import React, { useState } from 'react';
import { useGridStore } from '../../store/gridStore';
import { useObjectStore } from '../../store/objectStore';
import CellInfo from './CellInfo';
import '../../styles/menu.css';

const Menu = () => {
    const { selectedCells, placeObject, clearCell } = useGridStore();
    const { objects } = useObjectStore();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handlePlaceObject = (category, name) => {
        placeObject(category, name, objects);
    };

    const renderObjects = (category) => {
        if (!category) return null;
        return (
            <div className="object-wrapper">
                {Object.keys(objects[category]).map((name) => (
                    <button key={name} onClick={() => handlePlaceObject(category, name)}>
                        {name}
                    </button>
                ))}
            </div>
        );
    };

    const removeObjectHandler = () => {
        if (selectedCells) {
            selectedCells.forEach(({ rowIndex, colIndex }) => {
                clearCell(rowIndex, colIndex);
            });
        }
    };

    const isSelectedCell = () => selectedCells.length === 1;

    return (
        <div className="menu-wrapper">
            <div className="bottom-wrapper">
                {selectedCells.length !== 0 && renderObjects(selectedCategory)}
                <div className="category-wrapper">
                    <button onClick={() => setSelectedCategory('road')} disabled={selectedCategory === 'road'}>
                        Road
                    </button>
                    <button onClick={() => setSelectedCategory('building')} disabled={selectedCategory === 'building'}>
                        Building
                    </button>
                    <button onClick={() => setSelectedCategory('scenary')} disabled={selectedCategory === 'scenary'}>
                        Scenary
                    </button>
                    {selectedCells.length > 0 && <button onClick={removeObjectHandler} disabled={selectedCells.length === 0} >Remove</button>}
                </div>
            </div>
            {isSelectedCell() && <CellInfo />}
        </div>
    );
};

export default Menu;