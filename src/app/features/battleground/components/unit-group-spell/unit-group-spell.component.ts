import { Component, Input, OnChanges } from '@angular/core';
import { Icon } from 'src/app/core/assets';
import { Hero } from 'src/app/core/heroes';
import { PlayerState } from 'src/app/core/players';
import { SpellActivationType, Spell, SpellBaseType } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { TypedChanges } from 'src/app/core/utils';
import { MwCurrentPlayerStateService } from 'src/app/features/services';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-unit-group-spell',
  templateUrl: './unit-group-spell.component.html',
  styleUrls: ['./unit-group-spell.component.scss']
})
export class UnitGroupSpellComponent implements OnChanges {

  @Input()
  public currentUnit!: UnitGroup;

  @Input()
  public onCooldown: boolean | undefined = false;

  @Input()
  public hintPos: HintAttachment = 'above';

  @Input()
  public owner!: UnitGroup;

  @Input()
  public spell!: Spell;

  @Input()
  public hero!: Hero;

  public baseType!: SpellBaseType;

  public icon!: Icon;

  public disabled: boolean | undefined;

  public isPassive: boolean = false;

  constructor(
    private readonly curPlayerState: MwCurrentPlayerStateService,
  ) { }

  public ngOnChanges(changes: TypedChanges<this>): void {
    this.isPassive = this.spell.baseType.activationType === SpellActivationType.Passive;

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
