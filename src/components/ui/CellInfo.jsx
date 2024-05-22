import React from 'react';
import { useGridStore } from '../../store/gridStore';

const CellInfo = () => {
    const { selectedCells, cells, rotateObject } = useGridStore();

    if (selectedCells.length !== 1) return null;

    const { rowIndex, colIndex } = selectedCells[0];
    const cell = cells[rowIndex][colIndex];
    if (cell.type === 'empty') return null;

    return (
        <div className="cell-info-wrapper">
            <div className="cell-info">
                <h3>Cell Info</h3>
                <p>Cell: {rowIndex}, {colIndex}</p>
                <p>Type: {cell.type}</p>
                <p>Subtype: {cell.subtype}</p>
                <p>Rotation: {cell.rotation}</p>
                <button onClick={() => rotateObject(rowIndex, colIndex)}>Rotate</button>
            </div>
        </div>
    );
};

export default CellInfo;