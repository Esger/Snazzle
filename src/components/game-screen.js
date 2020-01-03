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

@inject(EventAggregator, TouchService, ScreenService, SnakeService, SnackService)

export class GameScreenCustomElement {

    constructor(eventAggregator, touchService, screenService, snakeService, snackService) {
        this.ea = eventAggregator;
        this.touchService = touchService;
        this.screenService = screenService;
        this.snakeService = snakeService;
        this.snackService = snackService;
        this.snakeImages = [];
        this.snackImages = [];
        this.spriteSize = 16;
        // images with these names.jpg should exist in /images/..
        this.snakeParts = this.snakeService.snakeParts;
        this.snackNames = this.snackService.names;
        this.snacks = this.snackService.snacks;
        this.animationTime = () => { return this.screenService.getAnimationTime(); };
    }

    roundToSpriteSize(size) {
        return Math.floor(size / this.spriteSize) * this.spriteSize;
    }

    snakeImage(index) {
        switch (index) {
            case 0: return 'head';
            case this.snakeService.snake.segments.length: return 'tail';
            default: return 'body';
        }
    }

    segmentCSS(index, x, y) {
        let rotationStr = '';
        if (index == 0) {
            let rotation = this.snakeService.snake.direction * 90;
            rotationStr = 'transform: rotate(' + rotation + 'deg);'
        }
        let css = 'left: ' + x + 'px; top: ' + y + 'px; ' + rotationStr + ' transition: all ' + this.animationTime + 's linear; -webkit-transition: all ' + this.animationTime() + 's linear;';
        return css;
    }

    snackPosition(index) {
        let snack = this.snackService.snacks[index];
        return {
            left: snack.position.x + 'px',
            top: snack.position.y + 'px'
        }
    }

    attached() {
        let self = this;
        this.$arena = $('.arena');
        let $body = $('body');
        let targetWidth = this.roundToSpriteSize($body.width() - 48);
        let targetHeight = this.roundToSpriteSize($body.height() - 48);
        this.$arena.width(targetWidth);
        this.$arena.height(targetHeight);
        this.touchService.setAreaSize(this.$arena);
        this.screenService.setDomVars(this.$arena);
    }

}
