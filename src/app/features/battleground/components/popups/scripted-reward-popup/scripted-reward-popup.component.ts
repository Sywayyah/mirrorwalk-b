import { Component, OnInit } from '@angular/core';
import { ScriptedReward } from 'src/app/core/structures';
import { StructPopupData } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-scripted-reward-popup',
  templateUrl: './scripted-reward-popup.component.html',
  styleUrls: ['./scripted-reward-popup.component.scss']
})
export class ScriptedRewardPopupComponent extends BasicPopup<StructPopupData> implements OnInit {

  public description!: string;

  private reward!: ScriptedReward;

  constructor(
    private players: MwPlayersService,
    private apiProvider: ApiProvider,
  ) {
    super();
  }

  public ngOnInit(): void {
    const generator = this.data.struct.generator;
    // consider dummy generator for locations with unneccessay generator
    const reward = generator?.generateReward?.() as ScriptedReward;

    if (reward) {
      this.reward = reward;
      this.description = reward.description;
    }
  }

  public closePopup(): void {
    this.reward.onAccept({
      playersApi: this.apiProvider.getPlayerApi(),
      spellsApi: this.apiProvider.getSpellsApi(),
      visitingPlayer: this.players.getCurrentPlayer(),
    });
    this.close();
  }
}
