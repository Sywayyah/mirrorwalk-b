
import { Player, PlayerTypeEnum } from 'src/app/core/players';
import { UnitBaseType, UnitGroup } from 'src/app/core/unit-types';
import { MwUnitGroupStateService } from '../mw-unit-group-state.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';
import { Hero, createHeroModelBase } from 'src/app/core/heroes';
import { DescriptionElementType } from 'src/app/core/ui';

export const testUnitTypeNoArmorNoRating: UnitBaseType = {
  id: '#ug-test',
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
  faction: {} as any,
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

const hero = new Hero('0');

hero.create({
  heroBase: createHeroModelBase({
    id: '#hero-test',
    abilities: [],
    army: [],
    generalDescription: { type: DescriptionElementType.FreeHtml },
    items: [],
    name: '',
    resources: {
      gems: 0,
      gold: 0,
      redCrystals: 0,
      wood: 0,
    },
    stats: {
      baseAttack: 0,
      baseDefence: 0,
      mana: 0,
    },
  }),
});

export const player = new Player('0');

player.create({
  color: '',
  hero: hero,
  resources: { gems: 0, gold: 0, redCrystals: 0, wood: 0 },
  type: PlayerTypeEnum.Player,
});

export const getCommonFunctions = (services: () => { unitsService: MwUnitGroupsService, unitState: MwUnitGroupStateService }) => {

  const createTestUnitGroup = (count: number) => services().unitsService.createUnitGroup(
    testUnitTypeNoArmorNoRating,
    { count },
  ) as UnitGroup;

  const getDamageDetails = (attacker: UnitGroup, attacked: UnitGroup) => {
    const damageDetails = services().unitState.getDetailedAttackInfo(attacker, attacked);

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
