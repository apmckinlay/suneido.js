import { SuEl, defMap } from './suEl';

export class SuEvent extends SuEl {
    constructor(public el: Event) {
        super();
    }
    type(): string {
        return 'Event';
    }
    display(): string {
        return `${this.type()}(<${this.el.type}>)`;
    }
}

if (typeof window !== 'undefined') {
    defMap(Event, SuEvent);
}