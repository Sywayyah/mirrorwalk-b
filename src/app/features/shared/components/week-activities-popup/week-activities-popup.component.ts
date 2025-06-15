import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BaseDialog } from 'src/app/core/dialogs';
import { acitivies, ActivityCategory, WeeklyActivity } from 'src/app/core/specialties';
import { MwPlayersService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';

function getActivityById(id: string): WeeklyActivity {
  return acitivies.find((activity) => activity.id === id)!;
}

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
      activityBases: [getActivityById('war-training'), getActivityById('tribute'), getActivityById('scholar')],
      choice: signal(getActivityById('war-training')),
    },
    {
      name: 'Medium',
      activityBases: [getActivityById('gem-cutting'), getActivityById('mysticism'), getActivityById('necromancy')],
      choice: signal(getActivityById('gem-cutting')),
    },
    {
      name: 'Advanced',
      activityBases: [
        getActivityById('masonry'),
        getActivityById('architecture'),
        getActivityById('crystal-illness'),
      ],
      choice: signal(getActivityById('masonry')),
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
