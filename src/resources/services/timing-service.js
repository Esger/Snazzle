import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SnakeService } from './snake-service';
import { SnackService } from './snack-service';
import { MazeService } from './maze-service';
import { ScreenService } from './screen-service';
import { ScoreService } from './score-service';

@inject(EventAggregator, SnakeService, SnackService, MazeService, ScreenService, ScoreService)

export class TimingService {
    constructor(eventAggregator, snakeService, snackService, mazeService, screenService, scoreService) {
        this.ea = eventAggregator;
        this.snakeService = snakeService;
        this.snackService = snackService;
        this._mazeService = mazeService;
        this._screenService = screenService;
        this._scoreService = scoreService;

        this._steps = 0;
        this.speed = 1;
        this.fallTimerHandle = null;
        this.animationRequest = null;
        this.pause = false;

        this.baseGrowInterval = 10;
        this.baseScoreInterval = 10;
        this.baseSnackInterval = 10;
        this.baseSpeedupInterval = 100;

        this.maxStepInterval = 240;
        this.minStepInterval = 20;
        this.changeStepInterval = 20;

        this.dropInterval = 10;
        this.snackDuration = 15000;

        // Dit hoort hier niet -> snakeService?
        this.methods = {
            axe: _ => {
                void (0);
            },
            beer: _ => {
                this.growSlower();
            },
            bunny: _ => {
                this.speedUp();
            },
            diamond: _ => {
                this._scoreService.update(10000);
            },
            gold: _ => {
                this._scoreService.update(1000);
            },
            ruby: _ => {
                this.multiPlyScore();
            },
            skull: _ => {
                this.dropSnake();
            },
            snail: _ => {
                this.slowDown();
            },
            trash: _ => {
                this.snackService.initSnacks();
            },
            viagra: _ => {
                this.growHarder();
            },
            weed: _ => {
                this.mixSnacks();
            }
        };

        this.setSubscribers();
    }

    startGame() {
        this.resetIntervals();
        this._scoreService.initScore();
        this.snakeService.initSnake();
        this.snackService.initSnacks();
        this._mazeService.initWalls();
        this.runGame();
    }

    runGame() {
        this.animationRequest = requestAnimationFrame(_ => { this.runGame(); });
        this._steps += 1;
        let grow = (this._steps % this.growInterval == 0);
        grow = false;
        // grow && this.ea.publish('grow', this.snakeService.snake.segments.length);
        // (this._steps % this.speedupInterval == 0) && this.speedUp();
        // (this._steps % this.snackInterval == 0) && this.snackService.addSnack();
        // let mazeTimingFactor = 1;
        // this._mazeService.timingFactor = mazeTimingFactor;
        // // if (this._steps % mazeTimingFactor == 0) {
        // //     this._mazeService.lower();
        // // }
        this.snakeService.step(grow);
        // this._scoreService.update(this.snakeService.snake.segments.length);
    }

    pauseGame() {
        this.pause = !this.pause;
        if (this.pause) {
            this.clearTimedEvents();
        } else {
            this.runGame();
        }
    }

    restart() {
        if (!this.pause) {
            this.clearTimedEvents();
            this.startGame();
        }
    }

    dropSnake() {
        this.fallTimerHandle = setInterval(_ => {
            this.snakeService.fallDown();
        }, this.dropInterval);
    }

    speedUp() {
        if (this.stepInterval > this.minStepInterval) {
            this.speed += 1;
            this.clearTimedEvents();
            this.stepInterval -= this.changeStepInterval;
            this._screenService.setAnimationTime(this.stepInterval * 0.001);
            this.runGame();
            this.ea.publish('speed', this.speed);
        }
    }

    slowDown() {
        if (this.stepInterval < this.maxStepInterval) {
            this.speed -= 1;
            this.clearTimedEvents();
            this.stepInterval += this.changeStepInterval;
            this._screenService.setAnimationTime(this.stepInterval * 0.001);
            this.runGame();
            this.ea.publish('speed', this.speed);
        }
    }

    growSlower() {
        this.growInterval += 5;
        setTimeout(_ => {
            this.growInterval -= 5;
        }, this.snackDuration);
    }

    growHarder() {
        if (this.growInterval > this.baseGrowInterval) {
            this.growInterval -= 5;
            setTimeout(_ => {
                this.growInterval += 5;
            }, this.snackDuration);
        }
    }

    multiPlyScore() {
        this._scoreService.setMultiplier();
        setTimeout(_ => {
            this._scoreService.resetMultiplier();
        }, this.snackDuration);
    }

    mixSnacks() {
        this.snackService.mixSnacks();
        setTimeout(_ => {
            this.snackService.unMixSnacks();
        }, this.snackDuration);
    }

    clearTimedEvents() {
        cancelAnimationFrame(this.animationRequest);
        clearInterval(this.fallTimerHandle);
    }

    setSubscribers() {
        let direction = 0;
        this.ea.subscribe('keyPressed', response => {
            switch (response) {
                case 'Enter': this.ea.publish('start');
                    break;
                case ' ': this.ea.publish('pause');
                    break;
            }
        });
        this.ea.subscribe('die', response => {
            this.clearTimedEvents();
            this.dropSnake();
        });
        this.ea.subscribe('start', response => {
            this.restart();
        });
        this.ea.subscribe('pause', response => {
            this.pauseGame();
        });
        this.ea.subscribe('gameOver', response => {
            this.clearTimedEvents();
        });
        this.ea.subscribe('snack', response => {
            let method = response.split(':')[0].toLowerCase();
            this.methods[method]();
        });
    }

    resetIntervals() {
        this.stepInterval = this.maxStepInterval;
        this._screenService.setAnimationTime(this.stepInterval * 0.001);
        this.scoreInterval = this.baseScoreInterval;
        this.growInterval = this.baseGrowInterval;
        this.speedupInterval = this.baseSpeedupInterval;
        this.snackInterval = this.baseSnackInterval;
        this.speed = 1;
    }

}