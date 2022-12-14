import {
    inject
} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { KeystrokeService } from 'resources/services/keystroke-service';
import { TouchService } from 'resources/services/touch-service';
import { TimingService } from 'resources/services/timing-service';

@inject(KeystrokeService, TouchService, TimingService, EventAggregator)

export class App {

    constructor(keystrokeService, touchService, timingService, eventAggregator) {
        this.keystrokeService = keystrokeService;
        this.touchService = touchService;
        this.timingService = timingService;
        this.ea = eventAggregator;
        this.message = 'Snazzle by ashWare';
    }

}
