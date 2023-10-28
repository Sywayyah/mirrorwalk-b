import { Component } from '@angular/core';
import { DisplayUnitGroupInfo, PlayerOpensHeroInfo } from 'src/app/core/events';
import { HERO_LEVELS_BREAKPOINTS } from 'src/app/core/heroes';
import { InventoryItems } from 'src/app/core/items';
import { Player } from 'src/app/core/players';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-player-info-panel',
  templateUrl: './mw-player-info-panel.component.html',
  styleUrls: ['./mw-player-info-panel.component.scss'],
})
export class MwPlayerInfoPanelComponent {
  public readonly player: Player = this.players.getCurrentPlayer();

  public readonly itemSlots = InventoryItems.getExtendedSlotTypes();

  constructor(
    private players: MwPlayersService,
    public state: State,
    private events: EventsService,
  ) { }

  public openPlayerInfo(): void {
    this.events.dispatch(PlayerOpensHeroInfo());
  }

  public getHeroActionHint(): string {
    const hero = this.player.hero;

    const nextLevel = hero.level + 1;

    const nextLevelXpRequired = HERO_LEVELS_BREAKPOINTS[nextLevel] - hero.experience;
    return `
    <div>${nextLevelXpRequired}xp is required to reach Level ${nextLevel}</div>
    <div>(${hero.experience}/${HERO_LEVELS_BREAKPOINTS[nextLevel]})</div>
    `;
  }

  displayUnitGroupInfo(unitGroup: UnitGroup): void {
    this.events.dispatch(DisplayUnitGroupInfo({ unitGroup }));
  }

}
