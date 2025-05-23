import { ChangeDetectionStrategy, Component, OnChanges, input } from '@angular/core';
import { Observable } from 'rxjs';
import { Spell } from 'src/app/core/spells';
import { DescriptionVariants } from 'src/app/core/ui';
import { UnitGroup, UnitGroupState, UnitTypeBaseStatsModel } from 'src/app/core/unit-types';
import { TypedChanges } from 'src/app/core/utils';

// this component can remain as it is
//  for now it will be displayed via popup
//  later might change
//  todo: provide RMB action hint for units
/* todo: create component for hero icon */
@Component({
  selector: 'mw-unit-group-info',
  templateUrl: './unit-group-info.component.html',
  styleUrls: ['./unit-group-info.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitGroupInfoComponent implements OnChanges {
  public readonly unitGroup = input.required<UnitGroup>();

  public unitStats$!: Observable<UnitGroupState>;

  public baseStats!: UnitTypeBaseStatsModel;

  public description!: { descriptions: DescriptionVariants['variants'][] };

  public spells!: Spell[];

  public effects!: Spell[];

  // todo: refactor later
  ngOnChanges(changes: TypedChanges<this>): void {
    this.unitStats$ = this.unitGroup().listenStats();
    this.baseStats = this.unitGroup().type.baseStats;
    const unitSpells = this.unitGroup().spells;
    this.effects = unitSpells.filter((spell) => spell.isEffect());
    this.spells = unitSpells.filter((spell) => !spell.isEffect());

    const unitGroup = this.unitGroup();
    this.description = unitGroup.type.getDescription?.({
      unit: unitGroup,
      unitBase: unitGroup.type,
    }) || { descriptions: [] };
  }
}
