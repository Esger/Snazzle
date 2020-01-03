import {
    inject
} from 'aurelia-framework';
import {
    EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)

export class TouchService {

    constructor(eventAggregator) {
        this.ea = eventAggregator;
        this.$area;
        this.clickAreaSize = {
            width: 1,
            height: 1,
            diagonal: 1
        }
        this.ea.subscribe('touch', (response) => {
            this.handleTouch(response);
        });
    }

    setAreaSize($area) {
        this.$area = $area;
        this.clickAreaSize.width = $area.width();
        this.clickAreaSize.height = $area.height();
        (this.clickAreaSize.width > 0) && (this.clickAreaSize.diagonal = this.clickAreaSize.height / this.clickAreaSize.width);
    }

    handleTouch(event) {
        let clickX;
        let clickY;
        if (event.layerX) {
            clickX = event.layerX;
            clickY = event.layerY;
        } else {
            let offset = this.$area.offset();
            let touch = event.touches[0];
            clickX = touch.pageX - offset.left;
            clickY = touch.pageY - offset.top;
        }
        let direction = 'undefined';
        if (clickY <= clickX * this.clickAreaSize.diagonal) {
            if (clickY <= (this.clickAreaSize.height - clickX)) {
                direction = 'ArrowUp';
            } else {
                direction = 'ArrowRight';
            }
        } else {
            if (clickY <= (this.clickAreaSize.height - clickX)) {
                direction = 'ArrowLeft';
            } else {
                direction = 'ArrowDown';
            }
        }
        this.ea.publish('keyPressed', direction);
        return false;
    }

}