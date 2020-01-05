import { inject } from 'aurelia-framework';
import { ScreenService } from './screen-service';

@inject(ScreenService)
export class MazeService {

    constructor(screenService) {
        this._screenService = screenService;
        this._minBrickSize = 50;
    }

    initWalls() {
        this._holes = 1;
        this._holeSize = 100;
        this.wallSize = this._screenService.spriteSize;
        this.stepSize = this.wallSize / 2;
        this.mazeWalls = [];
        this._wallWidth = this._screenService.arena.width;
        this.addWall();
    }

    randomBetween(min = 0, max) {
        let rand = Math.floor(Math.random() * (max - min))
        return rand + min;
    }

    addWall() {
        let bricks = [];
        bricks.push(this.getBrick(0, this._wallWidth - this._holeSize, true));
        let totalWidth = bricks[0].width + this._holeSize;
        // for (let i = 0; i < this._holes; i++) {
        //     // More than 1 hole
        // }
        bricks.push(this.getBrick(totalWidth, this._wallWidth - totalWidth));
        let wall = {
            animate: true,
            position: - this.wallSize,
            bricks: bricks
        }
        this.mazeWalls.push(wall);
    }

    getBrick(left, maxWidth, randomWidth = false) {
        let brick = {
            x: left,
            width: randomWidth ?
                this.randomBetween(this._minBrickSize, maxWidth) : maxWidth
        }
        return brick;
    }

    lower() {
        this.mazeWalls.forEach(wall => {
            wall.position += this.stepSize;
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