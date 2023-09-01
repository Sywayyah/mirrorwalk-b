import { Component, Input, OnChanges } from '@angular/core';
import { Icon } from 'src/app/core/assets';
import { Hero } from 'src/app/core/heroes';
import { Spell, SpellBaseType } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { TypedChanges } from 'src/app/core/utils';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-unit-group-spell-icon',
  templateUrl: './unit-group-spell-icon.component.html',
  styleUrls: ['./unit-group-spell-icon.component.scss']
})
export class UnitGroupSpellIconComponent implements OnChanges {

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

  @Input()
  public disabled: boolean | undefined = false;

  public baseType!: SpellBaseType;

  public icon!: Icon;

  public isPassive: boolean = false;

  public ngOnChanges(changes: TypedChanges<this>): void {
    if (changes.spell) {
      this.isPassive = this.spell.isPassive();
      this.baseType = this.spell.baseType;
      this.icon = this.baseType.icon;
    }
  }
}
