import { TestBed } from '@angular/core/testing';
import { TaltirHero } from 'src/app/core/heroes/humans';
import { InventoryItems } from 'src/app/core/items';
import { PlayerInstanceModel, PlayerTypeEnum } from 'src/app/core/players';
import { UnitBase, UnitGroupInstModel } from 'src/app/core/unit-types';
import { CombatInteractorService } from '../mw-combat-interactor.service';
import { MwPlayersService } from '../mw-players.service';
import { MwUnitGroupStateService } from '../mw-unit-group-state.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';

const testUnitTypeNoArmorNoRating: UnitBase = {
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

const player: PlayerInstanceModel = {
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

/*
  todo:
    Test more cases (maybe even mock random generator)

    Test healing.
*/
describe('Test unit hp/damage interactions', () => {
  TestBed.configureTestingModule({
    providers: [
      { provide: MwPlayersService, useValue: {} }
    ],
  });

  let unitsService: MwUnitGroupsService;
  let unitState: MwUnitGroupStateService;

  beforeAll(() => {
    unitsService = TestBed.inject(MwUnitGroupsService);
    unitState = TestBed.inject(MwUnitGroupStateService);
  });

  const createTestUnitGroup = (count: number) => unitsService.createUnitGroup(
    testUnitTypeNoArmorNoRating,
    { count },
    player
  ) as UnitGroupInstModel;

  const getDamageDetails = (attacker: UnitGroupInstModel, attacked: UnitGroupInstModel) => {
    const damageDetails = unitState.getDetailedAttackInfo(attacker, attacked, [], []);

    const damageFinalDetails = unitState.getFinalDamageInfoFromDamageDetailedInfo(damageDetails);

    return {
      damageDetails,
      damageFinalDetails,
    };
  };

  it('1 unit deals non-fatal damage', () => {
    const attackingGroup = createTestUnitGroup(1);
    const attackedGroup = createTestUnitGroup(1);

    const { damageDetails, damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    console.log(damageFinalDetails);
    expect(damageFinalDetails.finalDamage).toBe(2);
    expect(damageFinalDetails.finalUnitLoss).toBe(0);
    expect(damageFinalDetails.isDamageFatal).toBe(false);
    expect(damageFinalDetails.tailHpLeft).toBe(8);
  });

  it('ug(5) attacks ug(1) and deals fatal damage', () => {
    const attackingGroup = createTestUnitGroup(5);
    const attackedGroup = createTestUnitGroup(1);

    const { damageDetails, damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(10);
    expect(damageFinalDetails.finalUnitLoss).toBe(1);
    expect(damageFinalDetails.isDamageFatal).toBe(true);
    expect(damageFinalDetails.tailHpLeft).toBe(0);
  });

  it('ug(5) attacks ug(2) and destroys 1 unit, damage isn`t fatal', () => {
    const attackingGroup = createTestUnitGroup(5);
    const attackedGroup = createTestUnitGroup(2);

    const { damageDetails, damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(10);
    expect(damageFinalDetails.finalUnitLoss).toBe(1);
    expect(damageFinalDetails.isDamageFatal).toBe(false);
    expect(damageFinalDetails.tailHpLeft).toBe(10);
  });

  it('ug(6) attacks ug(2) and destroys 1 unit, damage isn`t fatal', () => {
    const attackingGroup = createTestUnitGroup(6);
    const attackedGroup = createTestUnitGroup(2);

    const { damageDetails, damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(12);
    expect(damageFinalDetails.finalUnitLoss).toBe(1);
    expect(damageFinalDetails.isDamageFatal).toBe(false);
    expect(damageFinalDetails.tailHpLeft).toBe(8);
  });
});
