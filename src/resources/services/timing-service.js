import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SnakeService } from './snake-service';
import { SnackService } from './snack-service';
import { ScreenService } from './screen-service';
import { ScoreService } from './score-service';

@inject(EventAggregator, SnakeService, SnackService, ScreenService, ScoreService)

export class TimingService {
    constructor(eventAggregator, snakeService, snackService, screenService, scoreService) {
        this.ea = eventAggregator;
        this.snakeService = snakeService;
        this.snackService = snackService;
        this.screenService = screenService;
        this.scoreService = scoreService;

        this.crawling = false;
        this.steps = 0;
        this.speed = 1;
        this.fallTimerHandle = null;
        this.stepTimerHandle = null;
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

        this.methods = {
            axe: () => {
                void (0)
            },
            beer: () => {
                this.growSlower();
            },
            bunny: () => {
                this.speedUp();
            },
            diamond: () => {
                this.scoreService.update(10000);
            },
            gold: () => {
                this.scoreService.update(1000);
            },
            ruby: () => {
                this.multiPlyScore()
            },
            skull: () => {
                this.dropSnake();
            },
            snail: () => {
                this.slowDown();
            },
            trash: () => {
                this.snackService.initSnacks();
            },
            viagra: () => {
                this.growHarder();
            },
            weed: () => {
                this.mixSnacks();
            }
        }

        this.setSubscribers();
    }

    startGame() {
        this.resetIntervals();
        this.scoreService.initScore();
        this.snakeService.initSnake();
        this.snackService.initSnacks();
        this.crawling = true;
        this.resumeGame();
    }

    resumeGame() {
        this.stepTimerHandle = setInterval(() => {
            this.drawScreen()
        }, this.stepInterval);
    }

    drawScreen() {
        this.steps += 1;
        let grow = (this.steps % this.growInterval == 0);
        grow && this.ea.publish('grow', this.snakeService.snake.segments.length);
        (this.steps % this.speedupInterval == 0) && this.speedUp();
        (this.steps % this.snackInterval == 0) && this.snackService.addSnack();
        this.snakeService.step(grow);
        this.scoreService.update(this.snakeService.snake.segments.length);
    }

    dropSnake() {
        this.fallTimerHandle = setInterval(() => {
            this.snakeService.fallDown();
        }, this.dropInterval);
    }

    speedUp() {
        if (this.stepInterval > this.minStepInterval) {
            this.speed += 1;
            this.clearTimedEvents();
            this.stepInterval -= this.changeStepInterval;
            this.screenService.setAnimationTime(this.stepInterval * .001);
            this.resumeGame();
            this.ea.publish('speed', this.speed);
        }
    }

    slowDown() {
        if (this.stepInterval < this.maxStepInterval) {
            this.speed -= 1;
            this.clearTimedEvents();
            this.stepInterval += this.changeStepInterval;
            this.screenService.setAnimationTime(this.stepInterval * .001);
            this.resumeGame();
            this.ea.publish('speed', this.speed);
        }
    }

    growSlower() {
        this.growInterval += 5;
        setTimeout(() => {
            this.growInterval -= 5;
        }, this.snackDuration);
    }

    growHarder() {
        if (this.growInterval > this.baseGrowInterval) {
            this.growInterval -= 5;
            setTimeout(() => {
                this.growInterval += 5;
            }, this.snackDuration);
        }
    }

    multiPlyScore() {
        this.scoreService.setMultiplier();
        setTimeout(() => {
            this.scoreService.resetMultiplier();
        }, this.snackDuration);
    }

    mixSnacks() {
        this.snackService.mixSnacks();
        setTimeout(() => {
            this.snackService.unMixSnacks();
        }, this.snackDuration);
    }

    clearTimedEvents() {
        clearInterval(this.stepTimerHandle);
        clearInterval(this.fallTimerHandle);
    }

    pauseGame() {
        if (this.crawling) {
            this.pause = !this.pause;
            if (this.pause) {
                this.clearTimedEvents();
            } else {
                this.resumeGame();
            }
        }
    }

    restart() {
        if (!this.pause) {
            this.clearTimedEvents();
            this.startGame();
        }
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
        this.screenService.setAnimationTime(this.stepInterval * .001);
        this.scoreInterval = this.baseSoreInterval;
        this.growInterval = this.baseGrowInterval;
        this.speedupInterval = this.baseSpeedupInterval;
        this.snackInterval = this.baseSnackInterval;
        this.speed = 1;
    }

}