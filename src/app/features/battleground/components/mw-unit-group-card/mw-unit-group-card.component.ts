import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  Signal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { HoverTypeEnum, PlayerHoversGroupCard } from 'src/app/core/events';
import { Player } from 'src/app/core/players';
import { UnitGroup, UnitGroupState } from 'src/app/core/unit-types';
import { injectHostElem } from 'src/app/core/utils';
import { BattleStateService, MwPlayersService, MwUnitGroupStateService } from 'src/app/features/services';
import { HintAttachment } from 'src/app/features/shared/components';
import { PROVIDE_UI_UNIT_GROUP, UIUnitProvider } from 'src/app/features/shared/directives';
import { StoreClient } from 'src/app/store';

@Component({
  selector: 'mw-unit-group-card',
  templateUrl: './mw-unit-group-card.component.html',
  styleUrls: ['./mw-unit-group-card.component.scss'],
  providers: [
    {
      provide: PROVIDE_UI_UNIT_GROUP,
      useExisting: forwardRef(() => MwUnitGroupCardComponent),
    },
  ],
  standalone: false,
  // improve optimization
  // one possible optimization - create sub-components for sub-parts of this card
  // another - try to check why cd is propogated to every card on hover
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MwUnitGroupCardComponent extends StoreClient() implements UIUnitProvider, OnInit, OnDestroy {
  readonly hostElem = injectHostElem();
  readonly mwBattleStateService = inject(BattleStateService);
  private readonly playersService = inject(MwPlayersService);
  private readonly unitsService = inject(MwUnitGroupStateService);
  private readonly renderer = inject(Renderer2);

  readonly unitGroup = input.required<UnitGroup>();
  readonly playerInfo = input.required<Player>();
  readonly side = input<'left' | 'right'>('left');

  readonly isCurrentUnitGroupActive = computed(() =>
    this.mwBattleStateService.state.mapGet(
      (state) => state.currentPlayer === this.playerInfo() && state.currentUnitGroup === this.unitGroup(),
    ),
  );

  // whether current player hovers an enemy
  readonly canCurrentPlayerAttack = computed(() =>
    this.mwBattleStateService.state.mapGet((state) => state.currentPlayer !== this.playerInfo()),
  );

  readonly effects = computed(() =>
    this.unitGroup()
      .getStateSignal()()
      .groupState.spells.filter((spell) => spell.isEffect()),
  );

  readonly spells = computed(() =>
    this.unitGroup()
      .getStateSignal()()
      .groupState.spells.filter((spell) => !spell.isEffect()),
  );

  readonly cardReady = output<MwUnitGroupCardComponent>();
  readonly cardDestroyed = output<void>();

  public isCardHovered: boolean = false;
  public isEnemyCard!: boolean;

  public attackingUnitGroup!: UnitGroup;

  public isGroupMelee: boolean = false;

  public unitStats$!: Observable<UnitGroupState>;
  public unitState!: Signal<UnitGroupState>;

  public initialCount: number = 0;

  public spellsHintsPosition!: HintAttachment;

  public isBoss?: boolean = false;

  public ngOnInit(): void {
    this.unitState = this.unitGroup().getStateSignal();
    this.spellsHintsPosition = 'above';

    this.isGroupMelee = !this.unitsService.isUnitGroupRanged(this.unitGroup());
    this.isEnemyCard = this.playersService.getCurrentPlayer() !== this.playerInfo();
    this.initialCount = this.unitGroup().count;
    const unitGroup = this.unitGroup();
    this.isBoss = unitGroup.type.defaultModifiers?.isBoss;
    this.cardReady.emit(this);
    this.unitStats$ = unitGroup.listenStats();

    /* Self-animating for summoned units.  */
    // In future, this approach is most likely going to change, I might introduce
    // some animating container, that will be able to animate any given element.
    // Which is going to be useful for fight queue as well.
    const isSummoned = unitGroup.modGroup.getModValue('isSummon');

    if (isSummoned) {
      this.renderer.addClass(this.hostElem, 'summoned');
    }
  }

  ngOnDestroy(): void {
    this.events.dispatch(
      PlayerHoversGroupCard({
        hoverType: HoverTypeEnum.Unhover,
      }),
    );
    this.cardDestroyed.emit();
  }

  public onCardHover(isHovered: boolean): void {
    this.isCardHovered = isHovered;

    if (isHovered) {
      const unitGroup = this.unitGroup();
      if (!unitGroup.isAlive) {
        this.events.dispatch(
          PlayerHoversGroupCard({
            hoverType: HoverTypeEnum.Unhover,
          }),
        );
        return;
      }

      this.events.dispatch(
        PlayerHoversGroupCard({
          hoverType: this.isEnemyCard ? HoverTypeEnum.EnemyCard : HoverTypeEnum.AllyCard,
          currentCard: this.mwBattleStateService.state.get().currentUnitGroup!,
          hoveredCard: unitGroup,
        }),
      );
    } else {
      this.events.dispatch(
        PlayerHoversGroupCard({
          hoverType: HoverTypeEnum.Unhover,
        }),
      );
    }
  }

  public getUnitGroup(): UnitGroup {
    return this.unitGroup();
  }
}
