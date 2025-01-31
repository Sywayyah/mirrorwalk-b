import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BaseDialog } from 'src/app/core/dialogs';
import {
  acitivies,
  ActivityCategory,
  WeeklyActivityType,
} from 'src/app/core/specialties';

@Component({
  selector: 'mw-week-activities-popup',
  templateUrl: './week-activities-popup.component.html',
  styleUrl: './week-activities-popup.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekActivitiesDialogComponent extends BaseDialog {
  readonly categories = signal<ActivityCategory[]>([
    {
      name: 'Basic',
      activityBases: [acitivies[2], acitivies[3], acitivies[4]],
      choice: signal(acitivies[2]),
    },
    {
      name: 'Medium',
      activityBases: [acitivies[1], acitivies[6], acitivies[7]],
      choice: signal(acitivies[1]),
    },
    {
      name: 'Advanced',
      activityBases: [acitivies[8], acitivies[9], acitivies[0]],
      choice: signal(acitivies[8]),
    },
  ]);

  readonly ActivityType = WeeklyActivityType;

  confirm(): void {
    this.close();
  }
}
