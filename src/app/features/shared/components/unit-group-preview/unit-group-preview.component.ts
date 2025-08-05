import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UnitBaseType } from "src/app/core/unit-types";


@Component({
    selector: 'mw-unit-group-preview',
    template: `
    <div style="display: flex; flex-direction: column;">
      <img src="../{{unitType().mainPortraitUrl}}">

      <div>
        {{unitType().name}} ({{count()}})
      </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UnitGroupPreviewComponent {
  unitType = input.required<UnitBaseType>();

  count = input.required<number>();
}
