import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { WeeklyActivity, WeeklyActivityType } from 'src/app/core/specialties';

@Component({
  selector: 'mw-week-activity-card',
  templateUrl: './week-activity-card.component.html',
  styleUrl: './week-activity-card.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class WeekActivityCardComponent {
  readonly activity = input.required<WeeklyActivity>();

  readonly ActivityType = WeeklyActivityType;
}
