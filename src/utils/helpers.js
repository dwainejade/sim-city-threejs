export const getNeighboringRoadCell = (row, col, cells) => {
    const neighbors = [];
    const directions = [
        { rowOffset: -1, colOffset: 0 }, // North
        { rowOffset: 1, colOffset: 0 },  // South
        { rowOffset: 0, colOffset: -1 }, // West
        { rowOffset: 0, colOffset: 1 }   // East
    ];

    directions.forEach(({ rowOffset, colOffset }) => {
        const newRow = row + rowOffset;
        const newCol = col + colOffset;
        if (newRow >= 0 && newRow < cells.length && newCol >= 0 && newCol < cells[0].length) {
            const neighborCell = cells[newRow][newCol];
            if (neighborCell.type === 'road') {
                neighbors.push({ row: newRow, col: newCol });
            }
        }
    });

    return neighbors.length > 0 ? neighbors[0] : null; // Return the first road neighbor or null if none found
};
