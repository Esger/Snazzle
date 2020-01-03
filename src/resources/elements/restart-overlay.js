import {
    inject,
    bindable
} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TouchService } from '../services/touch-service';

@inject(EventAggregator, TouchService)
export class RestartOverlayCustomElement {

    constructor(eventAggregator, touchService) {
        this.ea = eventAggregator;
        this.touchService = touchService;
        this.showOverlay = true;
        this.firstGame = true;
        this.started = false;
        this.pause = false;
    }

    start() {
        if (!this.started) {
            this.ea.publish('start');
            this.firstGame = false;
            this.started = true;
        }
        return false;
    }

    addEventListeners() {
        this.ea.subscribe('gameOver', response => {
            this.showOverlay = true;
            this.started = false;
        });
        this.ea.subscribe('start', response => {
            this.showOverlay = false;
        });
        this.ea.subscribe('pause', response => {
            this.pause = !this.pause;
        });
    }

    attached() {
        this.addEventListeners();
    }

}