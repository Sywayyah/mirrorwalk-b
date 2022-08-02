import { Component, OnInit } from '@angular/core';


enum EffectTypesEnum {
  Damage,
}

interface EffectModel {
  type: EffectTypesEnum;
}

interface DamageEffectModel extends EffectModel {
  type: EffectTypesEnum.Damage;
  lossNumber: number;
}

@Component({
  selector: 'mw-card-effects',
  templateUrl: './card-effects.component.html',
  styleUrls: ['./card-effects.component.scss']
})
export class CardEffectsComponent implements OnInit {

  public effectTypes: typeof EffectTypesEnum = EffectTypesEnum;

  public effects: EffectModel[] = [];

  constructor(
    // private hintsService: HintsService,
  ) {}

  ngOnInit(): void {
  }

  public addLossEffect(lossNumber: number): void {
    const damageVfx: DamageEffectModel = {
      type: EffectTypesEnum.Damage,
      lossNumber: lossNumber,
    };

    this.effects.push(damageVfx);

    setTimeout(() => {
      const vfxIndex = this.effects.indexOf(damageVfx);
      this.effects.splice(vfxIndex, 1);
    }, 1500);
  }

}
