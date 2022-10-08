import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScriptedReward } from 'src/app/core/model/structures.types';
import { MwPlayersService, ScriptedRewardPopup } from 'src/app/feature-sandbox/services';
import { MwHeroesService } from 'src/app/feature-sandbox/services/mw-heroes.service';
import { MwSpellsService } from 'src/app/feature-sandbox/services/mw-spells.service';
import { MwUnitGroupsService } from 'src/app/feature-sandbox/services/mw-unit-groups.service';

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
    private heroes: MwHeroesService,
    private spells: MwSpellsService,
    private unitGroups: MwUnitGroupsService,
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
      playersApi: {
        addExperienceToPlayer: (player, xpAmount) => {
          this.players.addExperienceToPlayer(player.id, xpAmount);
        },
        addUnitGroupToPlayer: (player, unitType, count) => {
          const unitGroup = this.unitGroups.createUnitGroup(unitType, { count }, player);
          this.players.addUnitGroupToTypeStack(player, unitGroup);
        },
        addManaToPlayer: (player, mana) => {
          this.heroes.addManaToHero(player.hero, mana);
        },
        addMaxManaToPlayer: (player, mana) => {
          this.heroes.addMaxManaToHero(player.hero, mana);
        },
        addSpellToPlayerHero: (player, spell) => {
          this.heroes.addSpellToHero(player.hero, spell);
        },
        getCurrentPlayer: () => this.players.getCurrentPlayer(),
        getCurrentPlayerUnitGroups: () => this.players.getUnitGroupsOfPlayer(this.players.getCurrentPlayer().id),
      },
      spellsApi: {
        createSpellInstance: (spell, options) => {
          return this.spells.createSpellInstance(spell, options);
        },
      },
      visitingPlayer: this.players.getCurrentPlayer(),
    });
    this.close.emit();
  }
}
