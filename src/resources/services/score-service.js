import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AureliaCookie } from 'aurelia-cookie';

@inject(EventAggregator)

export class ScoreService {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        // this.cookie = aureliaCookie;
        this.multiplier = 1;
        this.score = 0;
        this.highScore = this.readHighscore();
        this.ea.subscribe('gameOver', response => { this.saveHighscore(); });
        this.ea.subscribe('resetHigh', response => { this.resetHighscore(); });
    }

    update(amount) {
        (amount) && (this.score += amount * this.multiplier);
        this.highScore = Math.max(this.score, this.highScore);
        this.ea.publish('score', {
            score: this.score,
            highScore: this.highScore
        });
    }

    setMultiplier(factor) {
        if (factor) {
            this.multiplier = factor;
        } else {
            this.multiplier = 10;
        }
    }

    resetMultiplier() {
        this.multiplier = 1;
    }

    saveHighscore() {
        AureliaCookie.set('snazzle-highScore', this.highScore, {
            expiry: -1,
        });
    }

    readHighscore() {
        let hs = AureliaCookie.get('snazzle-highScore');
        if (hs > 0) {
            return hs;
        }
        return 0;
    }

    resetHighscore() {
        this.highScore = 0;
        this.saveHighscore();
    }

    initScore() {
        this.score = 0;
    }

}