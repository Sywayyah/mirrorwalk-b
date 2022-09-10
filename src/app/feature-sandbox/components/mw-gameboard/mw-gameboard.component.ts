import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { getDamageParts } from 'src/app/core/utils/utils';
import {
  BattleEventsService,
  BattleEvent,
  BattleStateService as MwBattleStateService,
  MwNeutralPlayerService,
  MwPlayersService,
  MwPlayerStateService
} from '../../services';
import { MwCardsMappingService } from '../../services/mw-cards-mapping.service';
import { CombatInteractorService } from '../../services/mw-combat-interactor.service';
import { MwUnitGroupCardComponent } from '../mw-unit-group-card/mw-unit-group-card.component';
import { VfxService } from '../ui-elements/vfx-layer/vfx.service';

@Component({
  selector: 'mw-mw-gameboard',
  templateUrl: './mw-gameboard.component.html',
  styleUrls: ['./mw-gameboard.component.scss'],
})
export class MwGameboardComponent implements OnInit, AfterViewInit {
  public mainPlayerUnitGroups!: UnitGroupInstModel[];
  public neutralPlayerGroups!: UnitGroupInstModel[];

  public mainPlayerInfo!: PlayerInstanceModel;
  public neutralPlayerInfo!: PlayerInstanceModel;

  public fightQueue!: UnitGroupInstModel[];

  @ViewChildren(MwUnitGroupCardComponent)
  public cards!: QueryList<MwUnitGroupCardComponent>;


  constructor(
    public readonly mwPlayerState: MwPlayerStateService,
    public readonly mwBattleState: MwBattleStateService,
    private readonly mwNeutralPlayer: MwNeutralPlayerService,
    private readonly cardsMapping: MwCardsMappingService,
    private readonly battleEvents: BattleEventsService,
    private readonly combatInteractor: CombatInteractorService,
    private readonly vfx: VfxService,
    private readonly cd: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    /* todo: potentially, a good place for ordering dependencies and logic order */
    this.mainPlayerUnitGroups = this.mwPlayerState.getUnitGroups();
    this.neutralPlayerGroups = this.mwNeutralPlayer.getUnitGroups();

    this.mainPlayerInfo = this.mwPlayerState.getPlayerInfo();
    this.neutralPlayerInfo = this.mwNeutralPlayer.getPlayerInfo();

    this.fightQueue = this.mwBattleState.getFightQueue();
  }

  public onCardReady(unitGroup: UnitGroupInstModel, cardRef: MwUnitGroupCardComponent): void {
    // this.cardsMapping.register(unitGroup, cardRef);
  }

  public onGroupDies(unitGroup: UnitGroupInstModel): void {
    this.cardsMapping.unregister(unitGroup);
  }

  public ngAfterViewInit(): void {
    this.cards.forEach(card => this.cardsMapping.register(card.unitGroup, card));

    /* init interactions only after view initialized and cards are available */
    this.initInteractions();

    this.cd.detectChanges();
  }

  private initInteractions(): void {
    this.combatInteractor.onBattleBegins();

    this.mwBattleState.initBattle(
      [...this.mainPlayerUnitGroups, ...this.neutralPlayerGroups],
      [this.mainPlayerInfo, this.neutralPlayerInfo]
    );

    this.mwBattleState.battleEvent$.subscribe(() => {
      this.mainPlayerUnitGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.mainPlayerInfo) as UnitGroupInstModel[];
      this.neutralPlayerGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.neutralPlayerInfo) as UnitGroupInstModel[];
      this.fightQueue = this.mwBattleState.getFightQueue();
    });

    this.battleEvents.onEvent(BattleEvent.On_Group_Damaged_By_Group).subscribe((event) => {
      this.vfx.createFloatingMessageForUnitGroup(event.attackedGroup, getDamageParts(event.damage, event.loss));
    });
  }
}
