import { Component, signal } from '@angular/core';
import {
  acitivies,
  ActivityCategory,
  WeeklyActivityType,
} from 'src/app/core/specialties';

@Component({
  selector: 'mw-week-activities-popup',
  imports: [],
  templateUrl: './week-activities-popup.component.html',
  styleUrl: './week-activities-popup.component.scss',
})
export class WeekActivitiesPopupComponent {
  readonly categories = signal<ActivityCategory[]>([
    {
      name: 'Basic',
      activityBases: [acitivies[2], acitivies[3], acitivies[4]],
    },
    {
      name: 'Medium',
      activityBases: [acitivies[1], acitivies[6], acitivies[7]],
    },
    {
      name: 'Advanced',
      activityBases: [acitivies[8], acitivies[9], acitivies[0]],
    },
  ]);

  readonly ActivityType = WeeklyActivityType;
}
