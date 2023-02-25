import { TaltirHero } from 'src/app/core/heroes/humans';
import { InventoryItems } from 'src/app/core/items';
import { PlayerInstanceModel, PlayerTypeEnum } from 'src/app/core/players';
import { UnitBase, UnitGroupInstModel } from 'src/app/core/unit-types';
import { MwUnitGroupStateService } from '../mw-unit-group-state.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';

export const testUnitTypeNoArmorNoRating: UnitBase = {
  name: 'Test Unit (No Armor/Attack Rating)',
  type: 'test-plain-stats',
  baseRequirements: {},
  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 2,
    },
    attackRating: 0,
    defence: 0,
    health: 10,
    speed: 4,
  },
  defaultTurnsPerRound: 1,
  fraction: {} as any,
  level: 1,
  minQuantityPerStack: 1,
  neutralReward: {
    experience: 0,
    gold: 0,
  },
  defaultModifiers: {},
  defaultSpells: [],
  mainPortraitUrl: '',
  upgraded: false,
};

export const player: PlayerInstanceModel = {
  color: '',
  hero: {
    base: TaltirHero,
    experience: 0,
    freeSkillpoints: 1,
    inventory: new InventoryItems(),
    items: [],
    level: 0,
    mods: [],
    name: '',
    spells: [],
    stats: {
      baseAttack: 0,
      baseDefence: 0,
      bonusAttack: 0,
      bonusDefence: 0,
      currentMana: 0,
      maxMana: 0,
    },
  },
  id: '1',
  resources: {
    gems: 0,
    gold: 0,
    redCrystals: 0,
    wood: 0,
  },
  type: PlayerTypeEnum.Player,
  unitGroups: [],
};

export const getCommonFunctions = (services: () => { unitsService: MwUnitGroupsService, unitState: MwUnitGroupStateService }) => {

  // const { unitState, unitsService } = services();

  const createTestUnitGroup = (count: number) => services().unitsService.createUnitGroup(
    testUnitTypeNoArmorNoRating,
    { count },
    player
  ) as UnitGroupInstModel;

  const getDamageDetails = (attacker: UnitGroupInstModel, attacked: UnitGroupInstModel) => {
    const damageDetails = services().unitState.getDetailedAttackInfo(attacker, attacked, [], []);

    const damageFinalDetails = services().unitState.getFinalDamageInfoFromDamageDetailedInfo(damageDetails);

    return {
      damageDetails,
      damageFinalDetails,
    };
  };


  return {
    createTestUnitGroup,
    getDamageDetails,
  };
};
