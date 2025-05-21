import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
    selector: 'mw-unit-group-buff',
    templateUrl: './unit-group-buff.component.html',
    styleUrls: ['./unit-group-buff.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UnitGroupBuffComponent {
  public buff = input.required<Spell>();
  public ownerUnit = input.required<UnitGroup>();
  public hintPos = input<HintAttachment>('above');

  public baseType = computed(() => this.buff().baseType);

  public icon = computed(() => this.baseType().icon);
}
