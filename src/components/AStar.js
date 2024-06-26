const DIRECTIONS = [
    { x: 1, z: 0 }, // North
    { x: 0, z: 1 },  // East
    { x: -1, z: 0 },  // South
    { x: 0, z: -1 }  // West
];

const getDirection = (from, to) => {
    if (from.row > to.row) return 0; // North
    if (from.col < to.col) return 1; // East
    if (from.row < to.row) return 2; // South
    if (from.col > to.col) return 3; // West
    return -1; // Invalid direction
};

const heuristic = (a, b) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

const aStar = (start, goal, waypoints) => {
    const startNode = waypoints.find(wp => wp.row === start.row && wp.col === start.col);
    const goalNode = waypoints.find(wp => wp.row === goal.row && wp.col === goal.col);

    if (!startNode || !goalNode) {
        console.error("Start or goal node not found in waypoints.");
        return [];
    }

    const openSet = new Set([startNode]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    waypoints.forEach(wp => {
        gScore.set(wp, Infinity);
        fScore.set(wp, Infinity);
    });

    gScore.set(startNode, 0);
    fScore.set(startNode, heuristic(startNode, goalNode));

    const reconstructPath = (cameFrom, current) => {
        const totalPath = [current];
        while (cameFrom.has(current)) {
            const prev = cameFrom.get(current);
            const direction = getDirection(prev, current);
            totalPath.push({ ...prev, dir: direction });
            current = prev;
        }
        return totalPath.reverse();
    };

    while (openSet.size > 0) {
        let current = null;
        let lowestFScore = Infinity;
        openSet.forEach(node => {
            if (fScore.get(node) < lowestFScore) {
                lowestFScore = fScore.get(node);
                current = node;
            }
        });

        if (current === goalNode) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);

        if (!current.neighbors || current.neighbors.length === 0) {
            console.error("Invalid neighbors for waypoint:", current);
            continue;
        }

        for (let neighbor of current.neighbors) {
            const neighborNode = waypoints.find(wp => wp.row === neighbor.row && wp.col === neighbor.col);
            if (!neighborNode) continue;

            const tentativeGScore = gScore.get(current) + 1;
            if (tentativeGScore < gScore.get(neighborNode)) {
                cameFrom.set(neighborNode, current);
                gScore.set(neighborNode, tentativeGScore);
                fScore.set(neighborNode, tentativeGScore + heuristic(neighborNode, goalNode));
                if (!openSet.has(neighborNode)) {
                    openSet.add(neighborNode);
                }
            }
        }
    }

    console.error("No path found from start to destination.");
    return [];
};

export { aStar };