import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScriptedReward } from 'src/app/core/model';
import { MwPlayersService, ScriptedRewardPopup } from 'src/app/feature-sandbox/services';
import { ApiProvider } from 'src/app/feature-sandbox/services/api-provider.service';

@Component({
  selector: 'mw-scripted-reward-popup',
  templateUrl: './scripted-reward-popup.component.html',
  styleUrls: ['./scripted-reward-popup.component.scss']
})
export class ScriptedRewardPopupComponent implements OnInit {

  @Input() public popup!: ScriptedRewardPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter();

  public description!: string;

  private reward!: ScriptedReward;

  constructor(
    private players: MwPlayersService,
    private apiProvider: ApiProvider,
) { }

  ngOnInit(): void {
    const generator = this.popup.struct.generator;
    const reward = generator.generateReward?.() as ScriptedReward;

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
    this.close.emit();
  }
}
