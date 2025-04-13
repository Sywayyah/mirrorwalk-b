import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BaseDialog } from 'src/app/core/dialogs';
import {
  acitivies,
  ActivityCategory
} from 'src/app/core/specialties';
import { MwPlayersService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';

@Component({
  selector: 'mw-week-activities-popup',
  templateUrl: './week-activities-popup.component.html',
  styleUrl: './week-activities-popup.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekActivitiesDialogComponent extends BaseDialog {
  private readonly apiProvider = inject(ApiProvider);
  private readonly playersService = inject(MwPlayersService);

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

  confirm(): void {
    const chosenActivities = this.categories().map((category) => category.choice());
    const currentPlayer = this.playersService.getCurrentPlayer();

    chosenActivities.forEach((activity) => {
      activity.init?.(this.apiProvider.getGameApi());
      currentPlayer.addWeeklyActivity(activity);
    });

    this.close();
  }
}
