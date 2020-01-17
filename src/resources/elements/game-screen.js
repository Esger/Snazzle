import {
    inject,
    bindable
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';
import { TouchService } from '../services/touch-service';
import { ScreenService } from '../services/screen-service';
import { SnakeService } from '../services/snake-service';
import { SnackService } from '../services/snack-service';
import { MazeService } from '../services/maze-service';

@inject(EventAggregator, TouchService, ScreenService, SnakeService, SnackService, MazeService)

export class GameScreenCustomElement {

    constructor(eventAggregator, touchService, screenService, snakeService, snackService, mazeService) {
        this.ea = eventAggregator;
        this.touchService = touchService;
        this._screenService = screenService;
        this.snakeService = snakeService;
        this.snackService = snackService;
        this.mazeService = mazeService;
        this.snakeImages = [];
        this.snackImages = [];
        this.spriteSize = 16;
        // images with these names.jpg must exist in /images/..
        this.snakeParts = this.snakeService.snakeParts;
        this.snackNames = this.snackService.names;
        this.snacks = this.snackService.snacks;
        this.headRotationTime = 0.2;
        this.animationTime = _ => {
            return this._screenService.getAnimationTime();
        };
    }

    snakeImage(index) {
        switch (index) {
            case 0: return 'head';
            case this.snakeService.snake.segments.length: return 'tail';
            default: return 'body';
        }
    }

    segmentCSS(index, x, y, animate) {
        let rotationStr = '';
        let animationTime = animate ? this.animationTime() : 0;
        if (index == 0) {
            let rotation = this.snakeService.snake.direction * 90;
            rotationStr = 'transform: rotate(' + rotation + 'deg);'
        }
        let css = 'left: ' + x + 'px; top: ' + y + 'px; ' + rotationStr
            + ' transition: transform ' + this.headRotationTime + 's linear';
        return css;
    }

    wallCSS(yPos, animate) {
        let animationTime = animate ? this.animationTime() * this.mazeService.timingFactor : 0;
        let css = 'top: ' + yPos + 'px; transition: all ' + animationTime + 's linear;';
        return css
    }

    attached() {
        let self = this;
        let $body = $('body');
        this.arenaWidth = this._screenService.roundToSpriteSize($body.width() - 96);
        this.arenaHeight = this._screenService.roundToSpriteSize($body.height() - 96);
        this.$arena = $('.arena');
        setTimeout(() => {
            this.touchService.setAreaSize(this.$arena);
            this._screenService.setDomVars(this.$arena);
        });
    }

}
