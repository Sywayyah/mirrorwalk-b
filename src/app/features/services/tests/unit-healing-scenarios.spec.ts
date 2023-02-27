import { TestBed } from '@angular/core/testing';
import { MwUnitGroupStateService } from '../mw-unit-group-state.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';
import { getCommonFunctions } from './common';


describe('test units healing', () => {
  TestBed.configureTestingModule({ providers: [] });

  let unitsService: MwUnitGroupsService;
  let unitState: MwUnitGroupStateService;

  beforeAll(() => {
    unitsService = TestBed.inject(MwUnitGroupsService);
    unitState = TestBed.inject(MwUnitGroupStateService);
  });

  const { createTestUnitGroup, getDamageDetails } = getCommonFunctions(() => ({ unitsService, unitState }));

  it(`shouldn't heal undamaged unit`, () => {
    const unitGroup = createTestUnitGroup(10);

    expect(unitGroup.fightInfo.initialCount).toBe(10);
    expect(unitGroup.count).toBe(10);

    const healData = unitsService.healUnit(unitGroup, 10);

    expect(healData.revivedUnitsCount).toBe(0);
    expect(healData.totalHealedHp).toBe(0);
    expect(unitGroup.count).toBe(10);
  });

  it(`shouldn't heal if no heal value`, () => {
    const unitGroup = createTestUnitGroup(10);

    expect(unitGroup.fightInfo.initialCount).toBe(10);
    expect(unitGroup.count).toBe(10);

    const healData = unitsService.healUnit(unitGroup, 0);

    expect(healData.revivedUnitsCount).toBe(0);
    expect(healData.totalHealedHp).toBe(0);
    expect(unitGroup.count).toBe(10);
  });

  it(`shouldn't heal if heal value is negative`, () => {
    const unitGroup = createTestUnitGroup(10);

    expect(unitGroup.fightInfo.initialCount).toBe(10);
    expect(unitGroup.count).toBe(10);

    const healData = unitsService.healUnit(unitGroup, -100);

    expect(healData.revivedUnitsCount).toBe(0);
    expect(healData.totalHealedHp).toBe(0);
    expect(unitGroup.count).toBe(10);
  });

  it(`should restore tail hp of slightly damaged unit group`, () => {
    // 6 damage isn't going to be enough to make losses
    const attackingGroup = createTestUnitGroup(3);
    const attackedGroup = createTestUnitGroup(10);

    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(6);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(4);

    const healDetails = unitsService.healUnit(attackedGroup, 10);

    expect(healDetails.revivedUnitsCount).toBe(0);
    expect(healDetails.totalHealedHp).toBe(6);
    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(10);
  });

  it(`should not completely tail hp of slightly damaged unit group`, () => {
    // 6 damage isn't going to be enough to make losses
    const attackingGroup = createTestUnitGroup(3);
    const attackedGroup = createTestUnitGroup(10);

    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(6);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(4);

    // heal unit, but not enough to fully heal the tail
    const healDetails = unitsService.healUnit(attackedGroup, 4);

    expect(healDetails.revivedUnitsCount).toBe(0);
    expect(healDetails.totalHealedHp).toBe(4);
    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(8);
  });


  it(`should revive slain unit and restore tail hp loss with overstacked healing`, () => {
    // 12 damage is going to make loss
    const attackingGroup = createTestUnitGroup(6);
    const attackedGroup = createTestUnitGroup(10);

    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(12);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    expect(attackedGroup.count).toBe(9);
    expect(attackedGroup.tailUnitHp).toBe(8);

    // revive 1 unit and heal the damaged tail hp
    const healDetails = unitsService.healUnit(attackedGroup, 20);

    expect(healDetails.revivedUnitsCount).toBe(1);
    expect(healDetails.totalHealedHp).toBe(12);
    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(10);
  });

  it(`shouldn't revive unit when heal value is only enough to cover tail hp loss`, () => {
    // 12 damage is going to make loss
    const attackingGroup = createTestUnitGroup(6);
    const attackedGroup = createTestUnitGroup(10);

    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(12);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    expect(attackedGroup.count).toBe(9);
    expect(attackedGroup.tailUnitHp).toBe(8);

    // only heal tail hp, shouldn't revive
    const healDetails = unitsService.healUnit(attackedGroup, 2);

    expect(healDetails.revivedUnitsCount).toBe(0);
    expect(healDetails.totalHealedHp).toBe(2);
    expect(attackedGroup.count).toBe(9);
    expect(attackedGroup.tailUnitHp).toBe(10);
  });

  it(`should revive unit when heal value is tail hp loss + 1`, () => {
    // 12 damage is going to make loss
    const attackingGroup = createTestUnitGroup(6);
    const attackedGroup = createTestUnitGroup(10);

    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    expect(damageFinalDetails.finalDamage).toBe(12);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    expect(attackedGroup.count).toBe(9);
    expect(attackedGroup.tailUnitHp).toBe(8);

    // revive 1 unit and heal the damaged tail hp
    const healDetails = unitsService.healUnit(attackedGroup, 3);

    expect(healDetails.revivedUnitsCount).toBe(1);
    expect(healDetails.totalHealedHp).toBe(3);
    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(1);

    // deal just 1 pure damage to slay tail hp unit
    unitState.dealPureDamageToUnitGroup(attackedGroup, 1);

    expect(attackedGroup.count).toBe(9);
    expect(attackedGroup.tailUnitHp).toBe(10);
  });

  it(`describes heal scenario 1`, () => {
    const attackedGroup = createTestUnitGroup(10);

    // 2 units perish, tail is damaged
    unitState.dealPureDamageToUnitGroup(attackedGroup, 24);

    expect(attackedGroup.count).toBe(8);
    expect(attackedGroup.tailUnitHp).toBe(6);

    // heal with not enough hp to restore anyone
    const healDetails = unitsService.healUnit(attackedGroup, 2);

    expect(healDetails.revivedUnitsCount).toBe(0);
    expect(healDetails.totalHealedHp).toBe(2);
    expect(attackedGroup.count).toBe(8);
    expect(attackedGroup.tailUnitHp).toBe(8);

    // heal that should revive one unit and max out damaged tail
    const healDetails2 = unitsService.healUnit(attackedGroup, 12);

    expect(healDetails2.revivedUnitsCount).toBe(1);
    expect(healDetails2.totalHealedHp).toBe(12);
    expect(attackedGroup.count).toBe(9);
    expect(attackedGroup.tailUnitHp).toBe(10);

    // revert latest heal effect
    unitState.dealPureDamageToUnitGroup(attackedGroup, 12);

    expect(attackedGroup.count).toBe(8);
    expect(attackedGroup.tailUnitHp).toBe(8);

    // heal that should revive 2 units, with low hp tail
    const healDetails3 = unitsService.healUnit(attackedGroup, 13);

    expect(healDetails3.revivedUnitsCount).toBe(2);
    expect(healDetails3.totalHealedHp).toBe(13);
    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(1);

    // heal all losses
    const healDetails4 = unitsService.healUnit(attackedGroup, 100);

    expect(healDetails4.revivedUnitsCount).toBe(0);
    expect(healDetails4.totalHealedHp).toBe(9);
    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(10);

    // slay slightly more than half
    unitState.dealPureDamageToUnitGroup(attackedGroup, 55);

    expect(attackedGroup.count).toBe(5);
    expect(attackedGroup.tailUnitHp).toBe(5);

    const healDetails5 = unitsService.healUnit(attackedGroup, 10);

    expect(healDetails5.revivedUnitsCount).toBe(1);
    expect(healDetails5.totalHealedHp).toBe(10);
    expect(attackedGroup.count).toBe(6);
    expect(attackedGroup.tailUnitHp).toBe(5);

    const healDetails6 = unitsService.healUnit(attackedGroup, 100);

    expect(healDetails6.revivedUnitsCount).toBe(4);
    expect(healDetails6.totalHealedHp).toBe(45);
    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(10);

    // deal exact fatal damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, 100);

    expect(attackedGroup.count).toBe(0);
    expect(attackedGroup.tailUnitHp).toBe(0);

    // heal enough to resurrect 1 unit with damaged tail
    const healDetails7 = unitsService.healUnit(attackedGroup, 6);

    expect(healDetails7.revivedUnitsCount).toBe(1);
    expect(healDetails7.totalHealedHp).toBe(6);
    expect(attackedGroup.count).toBe(1);
    expect(attackedGroup.tailUnitHp).toBe(6);

    // heal 1 more unit with tail
    const healDetails8 = unitsService.healUnit(attackedGroup, 8);

    expect(healDetails8.revivedUnitsCount).toBe(1);
    expect(healDetails8.totalHealedHp).toBe(8);
    expect(attackedGroup.count).toBe(2);
    expect(attackedGroup.tailUnitHp).toBe(4);

    // heal, max out health
    unitsService.healUnit(attackedGroup, 100);

    expect(attackedGroup.count).toBe(10);
    expect(attackedGroup.tailUnitHp).toBe(10);

    // overstacked damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, 1000);

    expect(attackedGroup.count).toBe(0);
    expect(attackedGroup.tailUnitHp).toBe(0);

    const healDetails9 = unitsService.healUnit(attackedGroup, 54);

    expect(healDetails9.revivedUnitsCount).toBe(6);
    expect(healDetails9.totalHealedHp).toBe(54);
    expect(attackedGroup.count).toBe(6);
    expect(attackedGroup.tailUnitHp).toBe(4);

    // heal out
    unitsService.healUnit(attackedGroup, 100);

    unitState.dealPureDamageToUnitGroup(attackedGroup, 20);

    expect(attackedGroup.count).toBe(8);
    expect(attackedGroup.tailUnitHp).toBe(10);

    const healDetails9a = unitsService.healUnit(attackedGroup, 10)

    expect(healDetails9a.revivedUnitsCount).toBe(1);
    expect(healDetails9a.totalHealedHp).toBe(10);
    expect(attackedGroup.count).toBe(9);
    expect(attackedGroup.tailUnitHp).toBe(10);


    // overstacked damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, 1000);

    expect(attackedGroup.count).toBe(0);
    expect(attackedGroup.tailUnitHp).toBe(0);

    const healDetails10 = unitsService.healUnit(attackedGroup, 20);

    expect(healDetails10.revivedUnitsCount).toBe(2);
    expect(healDetails10.totalHealedHp).toBe(20);
    expect(attackedGroup.count).toBe(2);
    expect(attackedGroup.tailUnitHp).toBe(10);

  });
});
