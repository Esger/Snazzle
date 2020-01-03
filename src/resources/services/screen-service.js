import {
    inject
} from 'aurelia-framework';

export class ScreenService {

    constructor(eventAggregator) {
        this.spriteSize = 16;
        this.halfSprite = this.spriteSize / 2;
        this.snackSize = 24;
        this.halfSnackSize = this.snackSize / 2;
        this.canvasCenter = {};
        this.limits = {};
        this.animationTime;
    }

    setAnimationTime(time) {
        this.animationTime = time;
    }

    getAnimationTime() {
        return this.animationTime;
    }

    setCanvasCenter(x, y) {
        this.canvasCenter = {
            x: x,
            y: y
        };
    }

    getCanvasCenter() {
        return this.canvasCenter;
    }

    setLimits(w, h) {
        this.limits = {
            right: w,
            bottom: h,
            left: 0,
            top: 0
        };
    }

    getLimits() {
        return this.limits;
    }

    roundToSpriteSize(size) {
        return Math.floor(size / this.spriteSize) * this.spriteSize;
    }

    setDomVars($arena) {
        this.canvas = $('#arena')[0];
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.setCanvasCenter(
            this.roundToSpriteSize($arena.width() / 2),
            this.roundToSpriteSize($arena.height() / 2)
        );
        this.setLimits(this.canvas.width, this.canvas.height);
    }

}