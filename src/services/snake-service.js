import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ScreenService } from './screen-service'
import { SnackService } from '../services/snack-service';

@inject(EventAggregator, ScreenService, SnackService)

export class SnakeService {
    constructor(eventAggregator, screenService, snackService) {
        this.ea = eventAggregator;
        this.screenService = screenService;
        this.snackService = snackService;
        this.snakeParts = [
            'head',
            'body',
            'tail'
        ];
        this.snake = {
            direction: 0,
            directions: [
                [[1, 0], [0, 1, 0, -1]],
                [[0, 1], [-1, 0, 1, 0]],
                [[-1, 0], [0, -1, 0, 1]],
                [[0, -1], [1, 0, -1, 0]],
                [[0, 0], [0, 0, 0, 0]]
            ],
            segments: [],
            deadSegments: []
        }
        this.snackMethods = {
            nope: () => {
                void (0);
            },
            axe: () => {
                this.cutSnake();
                this.ea.publish('snack', 'Axe: lost half of yourself');
            },
            beer: () => {
                this.ea.publish('snack', 'Beer: grow slower for 15 seconds');
            },
            bunny: () => {
                this.ea.publish('snack', 'Bunny: run faster for 15 seconds');
            },
            diamond: () => {
                this.ea.publish('snack', 'Diamond: 10000 points');
            },
            gold: () => {
                this.ea.publish('snack', 'Gold: 1000 points');
            },
            ruby: () => {
                this.ea.publish('snack', 'Ruby: score &times; 10 for 15 seconds');
            },
            skull: () => {
                this.ea.publish('snack', 'Skull: you die');
            },
            snail: () => {
                this.ea.publish('snack', 'Snail: run slower for 15 seconds');
            },
            trash: () => {
                this.ea.publish('snack', 'Trash: trash all extra&rsquo;s');
            },
            viagra: () => {
                this.ea.publish('snack', 'Viagra: grow harder for 15 seconds');
            },
            weed: () => {
                this.ea.publish('snack', 'Weed: high for 15 seconds')
            }
        }
        this.setSubscribers();
    }

    mod(m, n) {
        return ((m % n) + n) % n;
    }

    step(grow) {
        // limit the rate at which turns are accepted
        (this.snake.turnSteps > 0) && this.snake.turnSteps--;
        let tail = this.snake.segments[this.snake.segments.length - 1];
        let newTail = {};
        newTail.x = tail.x;
        newTail.y = tail.y;
        for (let i = this.snake.segments.length - 1; i > 0; i -= 1) {
            this.snake.segments[i].x = this.snake.segments[i - 1].x;
            this.snake.segments[i].y = this.snake.segments[i - 1].y;
        }
        this.snake.segments[0].x += this.snake.directions[this.mod(this.snake.direction, 4)][0][0] * this.snake.segmentSize;
        this.snake.segments[0].y += this.snake.directions[this.mod(this.snake.direction, 4)][0][1] * this.snake.segmentSize;
        this.hitWall();
        this.hitSnake();
        let head = this.snake.segments[0];
        let neck = head;
        (this.snake.segments.length > 1) && (neck = this.snake.segments[1]);
        let method = this.snackService.hitSnack(head, neck).toLowerCase();
        this.snackMethods[method]();
        (grow) && (this.snake.segments.push(newTail));
    }

    cutSnake() {
        let halfSnake = Math.floor(this.snake.segments.length / 2)
        this.snake.segments.splice(-halfSnake);
    }

    fallDown() {
        this.crawling = false;
        for (let i = 0; i < this.snake.segments.length; i++) {
            if (this.snake.deadSegments.indexOf(i) < 0) {
                let segment = this.snake.segments[i];
                let newY = (segment.y + 1) * 1.05;
                if (newY <= this.screenService.limits.bottom) {
                    segment.y = newY;
                } else {
                    this.snake.deadSegments.push(i);
                }
            }
        }
        if (this.snake.deadSegments.length >= this.snake.segments.length) {
            this.ea.publish('gameOver');
        }
    }

    hitWall() {
        let head = this.snake.segments[0];
        let wallHit =
            head.x > this.limits.right - this.snake.segmentSize ||
            head.x < this.limits.left ||
            head.y > this.limits.bottom - this.snake.segmentSize ||
            head.y < this.limits.top;
        if (wallHit) {
            this.ea.publish('die', 'You hit a wall');
            return true;
        }
        return false;
    }

    hitSnake() {
        let head = this.snake.segments[0];
        for (let i = 3; i < this.snake.segments.length - 1; i++) {
            let segment = this.snake.segments[i];
            if (this.samePosition(segment, head)) {
                this.ea.publish('die', 'You tried to bite yourself that&rsquo;s deadly');
                return true;
            }
        }
        return false;
    }

    samePosition(pos1, pos2) {
        return pos1.x == pos2.x && pos1.y == pos2.y;
    }

    setSubscribers() {
        let direction = 0;
        let newDirection = 0;
        let directions = {
            'ArrowRight': 0,
            'ArrowDown': 1,
            'ArrowLeft': 2,
            'ArrowUp': 3
        }
        this.ea.subscribe('keyPressed', response => {
            if (response.startsWith('Arrow') && this.snake.turnSteps == 0) {
                this.snake.turnSteps = 1;
                let directionChange = this.snake.directions[this.mod(this.snake.direction, 4)][1][directions[response]];
                this.snake.direction += directionChange;
            }
        });
    }

    minTurnSteps() {
        return Math.ceil(this.snake.segmentSize / this.snake.stepSize) + 1;
    }

    initSnake() {
        this.snake.segmentSize = this.screenService.spriteSize;
        this.halfSprite = Math.round(this.snake.segmentSize / 2);
        this.accelleration = 1.01;
        this.score = 0;
        this.snake.deadSegments = [];
        this.snake.stepSize = 16;
        this.snake.segments = [];
        this.snake.turnSteps = 0;
        this.limits = this.screenService.getLimits();
        let center = this.screenService.getCanvasCenter();
        let segment = {};
        segment.x = center.x;
        segment.y = center.y;
        this.snake.segments.push(segment);
    }
}