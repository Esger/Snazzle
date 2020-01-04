export class MazeService {

    constructor() {
        this.mazeWalls = [];
    }

    initWalls() {
        this.addWall();
    }

    addWall() {
        let wall = {
            position: -16
        }
        this.mazeWalls.push(wall);
    }

    lower() {
        this.mazeWalls.forEach(wall => {
            wall.position++;
        });
    }
}