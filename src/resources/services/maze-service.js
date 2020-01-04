import { inject } from 'aurelia-framework';
import { ScreenService } from './screen-service';

@inject(ScreenService)
export class MazeService {

    constructor(screenService) {
        this._screenService = screenService;
        this.wallSize = this._screenService.spriteSize;
        this.mazeWalls = [];
    }

    initWalls() {
        this.addWall();
    }

    addWall() {
        let wall = {
            animate: true,
            position: - this.wallSize
        }
        this.mazeWalls.push(wall);
    }

    lower() {
        this.mazeWalls.forEach(wall => {
            wall.position += this.wallSize;
            if (wall.position >
                this._screenService.arena.height + this.wallSize) {
                wall.animate = false;
                wall.position = - this.wallSize;
            } else {
                wall.animate = true;
            }
        });
    }
}