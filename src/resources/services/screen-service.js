export class ScreenService {

    constructor() {
        this.spriteSize = 16;
        this.stepSize = this.spriteSize / 16;
        this.snackSize = 24;
        this.halfSnackSize = this.snackSize / 2;
        this.mazeSize = 32;
        this.arenaCenter = {};
        this.limits = {};
        this._animationTime;
    }

    setAnimationTime(time) {
        this._animationTime = time;
    }

    getAnimationTime() {
        return this._animationTime;
    }

    setArenaCenter(x, y) {
        this.arenaCenter = {
            x: x,
            y: y
        };
    }

    getArenaCenter() {
        return this.arenaCenter;
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
        this.arena = $arena[0];
        this.arena.width = this.arena.clientWidth;
        this.arena.height = this.arena.clientHeight;
        this.setArenaCenter(
            Math.floor($arena.width() / 2),
            Math.floor($arena.height() / 2)
        );
        this.setLimits(this.arena.width, this.arena.height);
    }

}