import { Component, Input } from '@angular/core';
import { ActionCard } from 'src/app/core/action-cards';

@Component({
  selector: 'mw-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss']
})
export class ActionCardComponent {
  @Input()
  actionCard!: ActionCard;
}
