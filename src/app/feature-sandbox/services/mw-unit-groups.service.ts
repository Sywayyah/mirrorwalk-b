import { Injectable } from '@angular/core';
import { PlayerInstanceModel, UnitGroupInstModel, UnitGroupModel, UnitTypeModel } from 'src/app/core/model/main.model';
import { GenerationModel, GenerationUtils } from 'src/app/core/utils/common.utils';
import { MwSpellsService } from './mw-spells.service';

@Injectable({
  providedIn: 'root'
})
export class MwUnitGroupsService {

  constructor(
    private spells: MwSpellsService,
  ) { }
  /* todo: unify it */
  /*  todo: figure out diff between UnitGroupModel and Inst */

  public createUnitGroup(
    type: UnitTypeModel,
    options: { count: number },
    player: PlayerInstanceModel,
  ): UnitGroupModel {
    const unitGroup = {
      count: options.count,
      type: type,
      ownerPlayerRef: player,
      turnsLeft: type.defaultTurnsPerRound,
    };

    this.updateUnitGroupSpells(unitGroup);

    return unitGroup;
  }

  public createUnitGroupFromGenModel(
    genModel: GenerationModel,
  ): UnitGroupModel[] {
    return GenerationUtils
      .createRandomArmy(genModel)
      .map(unitGroup => this.updateUnitGroupSpells(unitGroup));
  }

  public createUnitGroupFromGenModelForPlayer(
    genModel: GenerationModel,
    player: PlayerInstanceModel,
  ): UnitGroupModel[] {
    return GenerationUtils
      .createRandomArmyForPlayer(genModel, player)
      .map(unitGroup => this.updateUnitGroupSpells(unitGroup));
  }

  private updateUnitGroupSpells(unitGroup: UnitGroupModel): UnitGroupModel {
    const unitGroupDefaultSpells = unitGroup.type.defaultSpells;

    if (unitGroupDefaultSpells) {
      (unitGroup as UnitGroupInstModel).spells = unitGroupDefaultSpells.map(spell => this.spells.createSpellInstance(spell));
    }

    return unitGroup;
  }
}
