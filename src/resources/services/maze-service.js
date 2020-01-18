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
        this._wallSize = this._screenService.spriteSize;
        this.stepSize = this._screenService.stepSize;
        this.mazeWalls = [];
        this.wallDistance = 300;
        this.maxWalls = Math.floor(this._screenService.arena.height / this.wallDistance);
        this._wallWidth = this._screenService.arena.width;
        this.addWall();
    }

    randomBetween(min = 0, max) {
        let rand = Math.floor(Math.random() * (max - min))
        return rand + min;
    }

    addWall() {
        let wallPosition = - this._wallSize;
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

    lower() {
        this.mazeWalls.forEach(wall => {
            wall.position += this.stepSize;
            if (wall.position >
                this._screenService.arena.height + this._wallSize) {
                wall.animate = false;
                wall.position = - this._wallSize;
            } else {
                wall.animate = true;
            }
        });
    }

    hitWall(segment) {
        let hitBrick = false;
        this.mazeWalls.forEach(wall => {
            let hitWall = (segment.y >= wall.position - this._wallSize &&
                segment.y < wall.position + this._wallSize);
            if (hitWall) {
                hitBrick = wall.bricks.some(brick => {
                    return segment.x + this._wallSize >= brick.x &&
                        segment.x <= brick.x + brick.width;
                });
            }
        });
        return hitBrick;
    }
}