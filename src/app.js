import {
    inject,
    bindable
} from 'aurelia-framework';
import $ from 'jquery';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeystrokeService } from './services/keystroke-service';
import { TouchService } from './services/touch-service';
import { TimingService } from './services/timing-service';

@inject(KeystrokeService, TouchService, TimingService, EventAggregator)

export class App {

    constructor(keystrokeService, touchService, timingService, eventAggregator) {
        this.keystrokeService = keystrokeService;
        this.touchService = touchService;
        this.timingService = timingService;
        this.ea = eventAggregator;
        this.message = 'Snake by ashWare';
    }

}
