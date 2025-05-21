import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionCardStack } from 'src/app/core/action-cards';

@Component({
    selector: 'mw-action-card-stack-item',
    template: `
    <mw-ra-icon [icon]="cardStack.card.icon" [style.color]="cardStack.card.iconColor" [style.background]="cardStack.card.bgColor" />

    <span style="font-weight: 600;">{{cardStack.card.title}} x{{cardStack.count}}</span>
  `,
    styles: `
    :host { display: block }

    mw-ra-icon {
      margin-right: 3px;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ActionCardItemStackComponent {
  @Input() cardStack!: ActionCardStack;
}
