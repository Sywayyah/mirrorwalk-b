import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  Signal,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupSpellsChanged, HoverTypeEnum, PlayerHoversGroupCard } from 'src/app/core/events';
import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { UnitGroup, UnitGroupState } from 'src/app/core/unit-types';
import { injectCdr, injectHostElem } from 'src/app/core/utils';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MwUnitGroupCardComponent extends StoreClient() implements UIUnitProvider, OnInit, OnDestroy {
  readonly hostElem = injectHostElem();
  readonly mwBattleStateService = inject(BattleStateService);
  private readonly playersService = inject(MwPlayersService);
  private readonly unitsService = inject(MwUnitGroupStateService);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = injectCdr();

  readonly unitGroup = input.required<UnitGroup>();
  readonly playerInfo = input.required<Player>();
  readonly side = input<'left' | 'right'>('left');

  readonly cardReady = output<MwUnitGroupCardComponent>();
  readonly groupDies = output<void>();

  public isCardHovered: boolean = false;
  public isEnemyCard!: boolean;

  public attackingUnitGroup!: UnitGroup;

  public canCurrentPlayerAttack: boolean = false;
  public isGroupMelee: boolean = false;

  public unitStats$!: Observable<UnitGroupState>;
  public unitState!: Signal<UnitGroupState>;

  public initialCount: number = 0;

  // todo: revisit, can become part of stats or something
  public spells: Spell[] = [];
  public effects: Spell[] = [];

  public spellsHintsPosition!: HintAttachment;

  public isBoss?: boolean = false;

  private readonly destroy$: Subject<void> = new Subject();

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

    this.updateSpellsAndEffects();

    this.events.eventStream$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      const currentUnitGroup = this.mwBattleStateService.currentUnitGroup;
      this.attackingUnitGroup = currentUnitGroup;
      this.canCurrentPlayerAttack = this.mwBattleStateService.currentPlayer === this.playersService.getCurrentPlayer();
      // optimize
      this.cdr.markForCheck();
    });

    this.events
      .onEvent(GroupSpellsChanged)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event) => {
        if (event.unitGroup === this.unitGroup()) {
          this.updateSpellsAndEffects();
        }
      });
  }

  public onDestroyed(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.events.dispatch(
      PlayerHoversGroupCard({
        hoverType: HoverTypeEnum.Unhover,
      }),
    );
    this.groupDies.emit();
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
          currentCard: this.mwBattleStateService.currentUnitGroup,
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

  public updateSpellsAndEffects(): void {
    const spells = this.unitGroup().spells;
    this.effects = spells.filter((spell) => spell.isEffect());

    this.spells = spells.filter((spell) => !spell.isEffect());
  }
}
