import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ScreenService } from './screen-service'

@inject(EventAggregator, ScreenService)

export class SnackService {
    constructor(eventAggregator, screenService) {
        this.ea = eventAggregator;
        this.screenService = screenService;
        this.snacks = [];
        this.mixUp = false;
        this.names = [
            'axe',
            'beer',
            'bunny',
            'diamond',
            'gold',
            'ruby',
            'skull',
            'snail',
            'trash',
            'viagra',
            'weed'
        ]
    }

    newSnack(x, y, name, i) {
        let snack = {
            position: {
                x: x,
                y: y
            },
            name: name,
            nameIndex: i
        }
        return snack;
    }

    samePosition(pos1, pos2) {
        return pos1.x == pos2.x && pos1.y == pos2.y;
    }

    hitSnack(head, neck) {
        for (let i = 0; i < this.snacks.length - 1; i++) {
            let snack = this.snacks[i];
            if (this.samePosition(snack.position, head) ||
                this.samePosition(snack.position, neck)) {
                this.removeSnack(i);
                if (this.mixUp) {
                    let randomSnack = Math.floor(Math.random() * this.names.length);
                    return this.names[randomSnack];
                } else {
                    return snack.name;
                }
            }
        }
        return 'nope';
    }

    addSnack() {
        let randomIndex = Math.floor(Math.random() * this.names.length);
        let snack = this.names[randomIndex];
        let x = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.right - this.screenService.spriteSize)))
        let y = this.screenService.roundToSpriteSize(Math.floor(Math.random() * (this.screenService.limits.bottom - this.screenService.spriteSize)))
        this.snacks.push(this.newSnack(x, y, snack, randomIndex));
    }

    mixSnacks() {
        this.mixUp = true;
    }

    unMixSnacks() {
        this.mixUp = false;
    }

    removeSnack(index) {
        this.snacks.splice(index, 1);
    }

    initSnacks() {
        this.snacks = [];
    }

}