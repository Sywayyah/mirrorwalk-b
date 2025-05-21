import { Component, input } from '@angular/core';
import { WeeklyActivity, WeeklyActivityType } from 'src/app/core/specialties';

@Component({
  selector: 'mw-week-activity-card',
  templateUrl: './week-activity-card.component.html',
  styleUrl: './week-activity-card.component.scss',
  standalone: false,
})
export class WeekActivityCardComponent {
  readonly activity = input.required<WeeklyActivity>();

  readonly ActivityType = WeeklyActivityType;

}
