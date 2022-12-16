import { Component, Input, OnChanges } from '@angular/core';
import { Icon } from 'src/app/core/assets';
import { SpellActivationType, SpellInstance, SpellModel } from 'src/app/core/spells';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { TypedChanges } from 'src/app/core/utils';
import { MwCurrentPlayerStateService, PlayerState } from 'src/app/features/services';

@Component({
  selector: 'mw-unit-group-spell',
  templateUrl: './unit-group-spell.component.html',
  styleUrls: ['./unit-group-spell.component.scss']
})
export class UnitGroupSpellComponent implements OnChanges {

  @Input()
  public currentUnit!: UnitGroupInstModel;

  @Input()
  public onCooldown: boolean | undefined = false;

  @Input()
  public owner!: UnitGroupInstModel;

  @Input()
  public spell!: SpellInstance;

  public baseType!: SpellModel;

  public icon!: Icon;

  public disabled: boolean | undefined;

  constructor(
    private readonly curPlayerState: MwCurrentPlayerStateService,
  ) { }

  public ngOnChanges(changes: TypedChanges<this>): void {
    if (changes.spell) {
      this.baseType = this.spell.baseType;
      this.icon = this.baseType.icon;
    }

    if (changes.currentUnit) {
      this.disabled = this.currentUnit !== this.owner
        && this.spell.baseType.activationType !== SpellActivationType.Passive;
    }
  }

  public onSpellClick(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    /* disable when player has no mana */

    if (this.onCooldown
      || this.disabled
      || !this.owner.fightInfo.isAlive
      || this.baseType.activationType === SpellActivationType.Passive) {
      return;
    }

    if (this.curPlayerState.playerCurrentState === PlayerState.WaitsForTurn) {
      return;
    }

    this.curPlayerState.onSpellClick(this.spell, this.owner);
  }
}