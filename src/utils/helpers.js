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


export const quadraticBezier = (p0, p1, p2, t) => {
    const u = 1 - t;
    return {
        x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
        z: u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z
    };
};

export const cubicBezier = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    return {
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        z: u * u * u * p0.z + 3 * u * u * t * p1.z + 3 * u * t * t * p2.z + t * t * t * p3.z
    };
};