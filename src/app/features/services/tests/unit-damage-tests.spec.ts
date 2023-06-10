import { TestBed } from '@angular/core/testing';
import { TaltirHero } from 'src/app/core/heroes/humans';
import { InventoryItems } from 'src/app/core/items';
import { Player, PlayerTypeEnum } from 'src/app/core/players';
import { UnitBaseType, UnitGroup } from 'src/app/core/unit-types';
import { CombatInteractorService } from '../mw-combat-interactor.service';
import { MwPlayersService } from '../mw-players.service';
import { MwUnitGroupStateService } from '../mw-unit-group-state.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';
import { testUnitTypeNoArmorNoRating, player, getCommonFunctions } from './common';

/*
  Unit type with no armor, attack rating and no damage range.
*/



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

  const { createTestUnitGroup, getDamageDetails } = getCommonFunctions(() => ({ unitsService, unitState }));

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
