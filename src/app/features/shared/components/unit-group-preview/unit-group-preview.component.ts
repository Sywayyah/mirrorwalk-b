import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { UnitBaseType, UnitGroup } from "src/app/core/unit-types";


@Component({
  selector: 'mw-unit-group-preview',
  template: `
    <div style="display: flex; flex-direction: column;">
      <img src="../assets/{{unitType.mainPortraitUrl}}">

      <div>
        {{unitType.name}} ({{count}})
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitGroupPreview {
  @Input()
  unitType!: UnitBaseType;

  @Input()
  count?: number;
}
