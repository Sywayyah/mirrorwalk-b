import { Component, HostBinding, Input, input } from '@angular/core';
import { ActionCard } from 'src/app/core/action-cards';

@Component({
  selector: 'mw-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss'],
  standalone: false,
})
export class ActionCardComponent {
  readonly actionCard = input.required<ActionCard>();

  @Input()
  @HostBinding('class')
  appearance: 'normal' | 'small' = 'normal';
}
