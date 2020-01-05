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
            direction: 0,
            // [   [dont care], [directionChanges for each direction]
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

        // limit the rate at which turns are accepted
        (this.snake.turnSteps > 0) && this.snake.turnSteps--;

        // construct new tail before new positions are calculated
        let newTail = {};
        if (grow) {
            let tail = this.snake.segments[this.snake.segments.length - 1];
            newTail.animate = tail.animate;
            newTail.x = tail.x;
            newTail.y = tail.y;
        }

        // segments get position of predecessor
        for (let i = this.snake.segments.length - 1; i > 0; i -= 1) {
            this.snake.segments[i].x = this.snake.segments[i - 1].x;
            this.snake.segments[i].y = this.snake.segments[i - 1].y;
            this.snake.segments[i].animate = this.snake.segments[i - 1].animate;
        }

        // head gets new position according to it's direction
        let head = this.snake.segments[0];
        head.x += this.snake.directions[this.mod(this.snake.direction, 4)][0][0] * this.snake.segmentSize;
        head.y += this.snake.directions[this.mod(this.snake.direction, 4)][0][1] * this.snake.segmentSize;

        // if head goes through side, don't animate
        let passRight = head.x > this._screenService.limits.right + this._screenService.spriteSize;
        let passLeft = head.x < - this._screenService.spriteSize;
        head.animate = !(passLeft || passRight);

        // set head to opposite side if passed through
        passRight && (head.x = -this._screenService.spriteSize);
        passLeft && (head.x = this._screenService.limits.right + this._screenService.spriteSize);

        // check if head bumps in mazeWall -> turn randomly, push down
        // this.hitMaze();

        this.hitBottom();
        // this.hitSnake();

        // check collision with head and neck for when snack was added late
        let neck = head;
        (this.snake.segments.length > 1) && (neck = this.snake.segments[1]);
        let method = this.snackService.hitSnack(head, neck).toLowerCase();
        this.snackMethods[method]();

        // add tail element
        (grow) && (this.snake.segments.push(newTail));
    }

    hitMaze() {
        let head = this.snake.segments[0];
        this._mazeService.mazeWalls.forEach(wall => {
            if (head.y > wall.position &&
                head.y <= wall.position + this._mazeService.wallSize) {
                let turn = Math.ceil(Math.random() * 2) - 1;
            }
        });
    }

    cutSnake() {
        let halfSnake = Math.floor(this.snake.segments.length / 2);
        this.snake.segments.splice(-halfSnake);
    }

    // change to explode()
    fallDown() {
        this.crawling = false;
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
        let bottomHit = head.y > this.limits.bottom - this.snake.segmentSize;
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
            if (response.startsWith('Arrow') && this.snake.turnSteps == 0) {
                this.snake.turnSteps = 1;
                this.turnTo(directions[response]);
            }
        });
    }

    turnTo(newDirection) {
        // Ensure head rotation doesn't spin wrong direction
        // when changing direction from 0 to 3 and vice versa
        // And ensure it cannot turn 180 degrees
        let directionChange = this.snake.directions[this.mod(this.snake.direction, 4)][1][newDirection];
        this.snake.direction += directionChange;
    }

    initSnake() {
        this.snake.segmentSize = this._screenService.spriteSize;
        this.halfSprite = Math.round(this.snake.segmentSize / 2);
        this.accelleration = 1.01;
        this.score = 0;
        this.snake.deadSegments = [];
        this.snake.stepSize = 16;
        this.snake.segments = [];
        this.snake.turnSteps = 0;
        this.limits = this._screenService.getLimits();
        let center = this._screenService.getArenaCenter();
        let segment = {};
        segment.x = center.x;
        segment.y = center.y;
        segment.animate = true;
        this.snake.segments.push(segment);
    }
}