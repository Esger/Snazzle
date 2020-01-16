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
        this._holeSize = 72;
        this.wallSize = this._screenService.spriteSize;
        this.stepSize = this.wallSize;
        this.mazeWalls = [];
        this.wallDistance = 250;
        this.maxWalls = Math.floor(this._screenService.arena.height / this.wallDistance);
        this._wallWidth = this._screenService.arena.width;
        this.addWall();
    }

    randomBetween(min = 0, max) {
        let rand = Math.floor(Math.random() * (max - min))
        return rand + min;
    }

    addWall() {
        let wallPosition = - this.wallSize;
        for (let i = 0; i < this.maxWalls; i++) {
            let bricks = [];
            bricks.push(this.getBrick(0, this._wallWidth - this._holeSize, true));
            let totalWidth = bricks[0].width + this._holeSize;
            bricks.push(this.getBrick(totalWidth, this._wallWidth - totalWidth));
            let wall = {
                animate: true,
                position: wallPosition,
                bricks: bricks
            }
            this.mazeWalls.push(wall);
            wallPosition = this._screenService.roundToSpriteSize(wallPosition + this.wallDistance);
        }
    }

    getBrick(left, maxWidth, randomWidth = false) {
        let brick = {
            x: left,
            width: randomWidth ?
                this.randomBetween(this._minBrickSize, maxWidth) : maxWidth
        }
        return brick;
    }

    set timingFactor(value) {
        this._timingFactor = value;
    }
    get timingFactor() {
        return this._timingFactor;
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