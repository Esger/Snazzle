import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ScreenService } from './screen-service';
import { SnackService } from './snack-service';
import { MazeService } from './maze-service';

@inject(EventAggregator, ScreenService, SnackService, MazeService)

export class SnakeService {
    constructor(eventAggregator, screenService, snackService, mazeService) {
        this.ea = eventAggregator;
        this._screenService = screenService;
        this.snackService = snackService;
        this._mazeService = mazeService;
        this.snakeParts = [
            'head',
            'body',
            'tail'
        ];
        this.snake = {
            // [   [x,y increment], [directionChanges for each direction]
            //     [[1, 0], [0, 1, 0, -1]],  right
            //     [[0, 1], [-1, 0, 1, 0]],  down
            //     [[-1, 0], [0, -1, 0, 1]], left
            //     [[0, -1], [1, 0, -1, 0]], up
            //     [[0, 0], [0, 0, 0, 0]]    stand
            // ]
            directions: [
                [[1, 0], [0, 1, 0, -1]],
                [[0, 1], [-1, 0, 1, 0]],
                [[-1, 0], [0, -1, 0, 1]],
                [[0, -1], [1, 0, -1, 0]],
                [[0, 0], [0, 0, 0, 0]]
            ],
            segments: [],
            deadSegments: []
        };
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
                this.ea.publish('snack', 'Weed: high for 15 seconds');
            }
        };
        this.setSubscribers();
    }

    mod(m, n) {
        return ((m % n) + n) % n;
    }

    step(grow) {
        // head gets new position according to it's direction
        this.turnDistance--;
        let head = this.snake.segments[0];
        this.advance(head);

        // segments get position of predecessor
        for (let i = this.snake.segments.length - 1; i > 0; i -= 1) {
            let current = this.snake.segments[i];
            let predecessor = this.snake.segments[i - 1];
            this.follow(current, predecessor);
        }

        this.hitBottom();
        // this.hitSnake();

        // check collision with head and neck for when snack was added late
        // let neck = head;
        // (this.snake.segments.length > 1) && (neck = this.snake.segments[1]);
        // let method = this.snackService.hitSnack(head, neck).toLowerCase();
        // this.snackMethods[method]();

        let newTail = {};
        if (grow) {
            let tail = this.snake.segments[this.snake.segments.length - 1];
            newTail.x = tail.x;
            newTail.y = tail.y;
            newTail.direction = tail.direction;
            this.snake.segments.push(newTail);
        }

    }

    follow(segment, predecessor) {
        if (segment.direction == predecessor.direction) {
            if (this.yTooFar(segment, predecessor, this._segmentSize) ||
                this.xTooFar(segment, predecessor, this._segmentSize)) {
                this.advanceXorY(segment);
            }
        } else { // the predecessor has turned
            if (this.movesVertical(segment)) {
                if (this.yTooFar(segment, predecessor, 1)) {
                    this.advanceXorY(segment);
                } else {
                    segment.direction = predecessor.direction;
                    this.advanceXorY(segment);
                }
            } else { // it moves horizontally
                if (this.xTooFar(segment, predecessor, 1)) {
                    this.advanceXorY(segment);
                } else {
                    segment.direction = predecessor.direction;
                    this.advanceXorY(segment);
                }
            }
        }
        this.throughSide(segment);
    }

    yTooFar(segment, predecessor, offset) {
        return Math.abs(segment.y - predecessor.y) >= offset;
    }

    xTooFar(segment, predecessor, offset) {
        return Math.abs(segment.x - predecessor.x) >= offset;
    }

    advanceXorY(segment) {
        segment.x += this.snake.directions[this.mod(segment.direction, 4)][0][0] * this._stepSize;
        segment.y += this.snake.directions[this.mod(segment.direction, 4)][0][1] * this._stepSize;
    }

    throughSide(segment) {
        // set head to opposite side if passed through
        (segment.x > this._screenService.limits.right) &&
            (segment.x = -this._segmentSize);
        (segment.x < - this._segmentSize) &&
            (segment.x = this._screenService.limits.right);
    }

    pushDown(segment) {
        (this.mod(segment.direction, 2) == 1) ? segment.y-- : segment.y++;
    }

    movesVertical(segment) {
        return this.mod(segment.direction, 2) == 1;
    }

    advance(segment) {
        if (this._mazeService.hitWall(segment)) {
            this.pushDown(segment);
            if (this.movesVertical(segment)) {
                let directions = [0, 2];
                let newDirection = directions[Math.ceil(Math.random() * 2) - 1];
                this.turnTo(segment, newDirection);
            }
        } else {
            this.advanceXorY(segment);
        }
        this.throughSide(segment);
    }

    // TODO let cut off part fall down :)
    cutSnake() {
        let halfSnake = Math.floor(this.snake.segments.length / 2);
        this.snake.segments.splice(-halfSnake);
    }

    // change to explode()
    fallDown() {
        for (let i = 0; i < this.snake.segments.length; i++) {
            if (this.snake.deadSegments.indexOf(i) < 0) {
                let segment = this.snake.segments[i];
                let newY = (segment.y + 1) * 1.05;
                if (newY <= this._screenService.limits.bottom) {
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

    // hitTop -> win
    // left / right -> pass through
    hitBottom() {
        let head = this.snake.segments[0];
        let bottomHit = head.y > this.limits.bottom - this._segmentSize;
        if (bottomHit) {
            this.ea.publish('die', 'You&rsquo;re dirt');
            return true;
        }
        return false;
    }

    // Dit niet?
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
        let directions = {
            'ArrowRight': 0,
            'ArrowDown': 1,
            'ArrowLeft': 2,
            'ArrowUp': 3
        };
        this.ea.subscribe('keyPressed', response => {
            if (response.startsWith('Arrow')) {
                if (this.turnDistance <= 0) {
                    this.turnTo(this.snake.segments[0], directions[response]);
                    this.turnDistance = this._segmentSize;
                    console.log(this.turnDistance);
                }
            }
        });
    }

    turnTo(segment, newDirection) {
        // Ensure head rotation doesn't spin wrong direction
        // when changing direction from 0 to 3 and vice versa
        // And ensure it cannot turn 180 degrees
        let directionChange = this.snake.directions[this.mod(segment.direction, 4)][1][newDirection];
        segment.direction += directionChange;
    }

    initSnake() {
        this.score = 0;
        this._segmentSize = this._screenService.spriteSize;
        this._stepSize = this._screenService.stepSize;
        this.snake.deadSegments = [];
        this.snake.segments = [];
        this.turnDistance = 0;
        this.limits = this._screenService.getLimits();
        let center = this._screenService.getArenaCenter();
        let y = Math.floor(this.limits.bottom * 0.8);
        let head = {
            x: center.x,
            y: y,
            direction: Math.floor(Math.random() * 4)
        };
        this.snake.segments.push(head);
    }
}