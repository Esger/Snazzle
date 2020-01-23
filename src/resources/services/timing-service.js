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
        this._snakeService = snakeService;
        this._snackService = snackService;
        this._mazeService = mazeService;
        this._screenService = screenService;
        this._scoreService = scoreService;

        this._steps = 0;
        this._speed = 1;
        this.fallTimerHandle = null;
        this._animationRequest = null;
        this.pause = false;

        this._baseGrowInterval = 100;
        this._baseScoreInterval = 10;
        this.baseSnackInterval = 10;
        this.baseSpeedupInterval = 100;

        this.maxStepInterval = 240;
        this._minStepInterval = 20;
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
                this._snackService.initSnacks();
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
        this._snakeService.initSnake();
        this._snackService.initSnacks();
        this._mazeService.initWalls();
        this.runGame();
    }

    runGame() {
        this._animationRequest = requestAnimationFrame(_ => { this.runGame(); });
        this._steps += 1;
        let grow = (this._steps % this._growInterval == 0);
        grow && this.ea.publish('grow', this._snakeService.snake.segments.length);
        // (this._steps % this.speedupInterval == 0) && this.speedUp();
        // (this._steps % this.snackInterval == 0) && this.snackService.addSnack();
        if (this._steps % this._mazeTimingFactor == 0) {
            this._mazeService.lower();
        }
        this._snakeService.step(grow);
        if (this._steps % this._scoreInterval == 0) {
            this._scoreService.update(this._snakeService.snake.segments.length);
        }
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
            this._snakeService.fallDown();
        }, this.dropInterval);
    }

    speedUp() {
        if (this._stepInterval > this._minStepInterval) {
            this._speed += 1;
            this.clearTimedEvents();
            this._stepInterval -= this.changeStepInterval;
            this._screenService.setAnimationTime(this._stepInterval * 0.001);
            this.runGame();
            this.ea.publish('speed', this._speed);
        }
    }

    slowDown() {
        if (this._stepInterval < this.maxStepInterval) {
            this._speed -= 1;
            this.clearTimedEvents();
            this._stepInterval += this.changeStepInterval;
            this._screenService.setAnimationTime(this._stepInterval * 0.001);
            this.runGame();
            this.ea.publish('speed', this._speed);
        }
    }

    growSlower() {
        this._growInterval += 5;
        setTimeout(_ => {
            this._growInterval -= 5;
        }, this.snackDuration);
    }

    growHarder() {
        if (this._growInterval > this._baseGrowInterval) {
            this._growInterval -= 5;
            setTimeout(_ => {
                this._growInterval += 5;
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
        this._snackService.mixSnacks();
        setTimeout(_ => {
            this._snackService.unMixSnacks();
        }, this.snackDuration);
    }

    clearTimedEvents() {
        cancelAnimationFrame(this._animationRequest);
        clearInterval(this.fallTimerHandle);
    }

    setSubscribers() {
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
        this._stepInterval = this.maxStepInterval;
        this._screenService.setAnimationTime(this._stepInterval * 0.001);
        this._scoreInterval = this._baseScoreInterval;
        this._growInterval = this._baseGrowInterval;
        this.speedupInterval = this.baseSpeedupInterval;
        this.snackInterval = this.baseSnackInterval;
        this._mazeTimingFactor = 2;
        this._speed = 1;
    }

}