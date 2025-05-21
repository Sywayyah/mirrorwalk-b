import { TestBed } from '@angular/core/testing';
import { MwUnitGroupStateService } from '../mw-unit-group-state.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';
import { getCommonFunctions } from './common';


describe('one-side damage scenarios', () => {
  TestBed.configureTestingModule({ providers: [] });

  let unitsService: MwUnitGroupsService;
  let unitState: MwUnitGroupStateService;

  beforeAll(() => {
    unitsService = TestBed.inject(MwUnitGroupsService);
    unitState = TestBed.inject(MwUnitGroupStateService);
  });

  const { createTestUnitGroup, getDamageDetails } = getCommonFunctions(() => ({ unitsService, unitState }));

  it('should deal damage', () => {
    const attackingGroup = createTestUnitGroup(5);
    const attackedGroup = createTestUnitGroup(2);

    // check attacked group before attack
    expect(attackedGroup.count).toBe(2);
    expect(attackedGroup.tailUnitHp).toBe(10);
    expect(attackedGroup.isAlive).toBe(true);

    // getting damage info of attacking group against attacked
    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    // check damage info
    expect(damageFinalDetails.finalDamage).toBe(10);
    expect(damageFinalDetails.isDamageFatal).toBe(false);
    expect(damageFinalDetails.finalUnitLoss).toBe(1);

    // deal calculated damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    // check the result of unit being damaged
    expect(attackedGroup.count).toBe(1);
    expect(attackedGroup.tailUnitHp).toBe(10);
    // ---> for now, those services do not handle it when dealing damage.
    // expect(attackedGroup.fightInfo.isAlive).toBe(true);
  });


  it('should deal uneven non-lethal damage', () => {
    // 7 units should deal 14 damage
    const attackingGroup = createTestUnitGroup(7);
    // 3 units have 30 hp
    const attackedGroup = createTestUnitGroup(3);

    // getting damage info of attacking group against attacked
    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    // check damage info
    expect(damageFinalDetails.finalDamage).toBe(14);
    expect(damageFinalDetails.isDamageFatal).toBe(false);
    expect(damageFinalDetails.finalUnitLoss).toBe(1);

    // deal calculated damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    // check the result of unit being damaged
    expect(attackedGroup.count).toBe(2);
    expect(attackedGroup.tailUnitHp).toBe(6);
    // expect(attackedGroup.fightInfo.isAlive).toBe(true);
  });


  it('deals lethal damage when final dmg === total hp of target', () => {
    // 15 units should deal 30 damage
    const attackingGroup = createTestUnitGroup(15);
    // 3 units have 30 hp
    const attackedGroup = createTestUnitGroup(3);

    // getting damage info of attacking group against attacked
    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    // check damage info
    expect(damageFinalDetails.finalDamage).toBe(30);
    expect(damageFinalDetails.isDamageFatal).toBe(true);
    expect(damageFinalDetails.finalUnitLoss).toBe(3);

    // deal calculated damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    // check the result of unit being damaged
    expect(attackedGroup.count).toBe(0);
    expect(attackedGroup.tailUnitHp).toBe(0);
    // expect(attackedGroup.fightInfo.isAlive).toBe(false);
  });


  it('deals lethal damage when final dmg > total hp of target', () => {
    // 40 units should deal 80 damage
    const attackingGroup = createTestUnitGroup(40);
    // 3 units have 30 hp
    const attackedGroup = createTestUnitGroup(3);

    // getting damage info of attacking group against attacked
    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    // check damage info
    expect(damageFinalDetails.finalDamage).toBe(80);
    expect(damageFinalDetails.isDamageFatal).toBe(true);
    expect(damageFinalDetails.finalUnitLoss).toBe(3);

    // deal calculated damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    // check the result of unit being damaged
    expect(attackedGroup.count).toBe(0);
    expect(attackedGroup.tailUnitHp).toBe(0);
    // expect(attackedGroup.fightInfo.isAlive).toBe(false);
  });

  it('deals damage correctly when damage is slightly not enough', () => {
    // 14 units should deal 28 damage
    const attackingGroup = createTestUnitGroup(14);
    // 3 units have 30 hp
    const attackedGroup = createTestUnitGroup(3);

    // getting damage info of attacking group against attacked
    const { damageFinalDetails } = getDamageDetails(attackingGroup, attackedGroup);

    // check damage info
    expect(damageFinalDetails.finalDamage).toBe(28);
    expect(damageFinalDetails.isDamageFatal).toBe(false);
    expect(damageFinalDetails.finalUnitLoss).toBe(2);

    // deal calculated damage
    unitState.dealPureDamageToUnitGroup(attackedGroup, damageFinalDetails.finalDamage);

    // check the result of unit being damaged
    expect(attackedGroup.count).toBe(1);
    expect(attackedGroup.tailUnitHp).toBe(2);
    // expect(attackedGroup.fightInfo.isAlive).toBe(false);
  });

  it('deals simple damage scenario (2 attacks)', () => {
    // 3 units should deal 6 damage
    const attackingGroupA = createTestUnitGroup(3);
    // 6 units should deal 12 damage
    const attackingGroupB = createTestUnitGroup(6);
    // 3 units have 30 hp
    const attackedGroup = createTestUnitGroup(3);

    const { damageFinalDetails: damageDetailsA } = getDamageDetails(attackingGroupA, attackedGroup);

    expect(damageDetailsA.finalDamage).toBe(6);
    expect(damageDetailsA.finalUnitLoss).toBe(0);
    expect(damageDetailsA.isDamageFatal).toBe(false);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsA.finalDamage);

    // target loses 6 hp, no losses, tail is 4
    expect(attackedGroup.count).toBe(3);
    expect(attackedGroup.tailUnitHp).toBe(4);

    const { damageFinalDetails: damageDetailsB } = getDamageDetails(attackingGroupB, attackedGroup);

    expect(damageDetailsB.finalDamage).toBe(12);
    expect(damageDetailsB.finalUnitLoss).toBe(1);
    expect(damageDetailsB.isDamageFatal).toBe(false);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsB.finalDamage);

    // target loses 12 hp, there are losses, tail is 2
    expect(attackedGroup.count).toBe(2);
    expect(attackedGroup.tailUnitHp).toBe(2);
  });

  it('deals complex damage scenario', () => {
    // 2 units should deal 4 damage
    const attackingGroupA = createTestUnitGroup(2);
    // 3 units should deal 6 damage
    const attackingGroupB = createTestUnitGroup(3);
    // 8 units should deal 16 damage
    const attackingGroupC = createTestUnitGroup(8);

    // 5 units have 50 hp
    const attackedGroup = createTestUnitGroup(5);

    /*
      Scenario:
        GroupA attacks 2 times in a row,
        GroupB attacks 1 time,
        GroupC attacks 2 times in a row,
        GroupB attacks 1 time,
    */

    // group A deals damage first
    const { damageFinalDetails: damageDetailsA } = getDamageDetails(attackingGroupA, attackedGroup);

    expect(damageDetailsA.finalDamage).toBe(4);
    expect(damageDetailsA.finalUnitLoss).toBe(0);
    expect(damageDetailsA.tailHpLeft).toBe(6);
    expect(damageDetailsA.isDamageFatal).toBe(false);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsA.finalDamage);

    expect(attackedGroup.count).toBe(5);
    expect(attackedGroup.tailUnitHp).toBe(6);

    // group A deals damage again
    const { damageFinalDetails: damageDetailsA2 } = getDamageDetails(attackingGroupA, attackedGroup);

    expect(damageDetailsA2.finalDamage).toBe(4);
    expect(damageDetailsA2.finalUnitLoss).toBe(0);
    expect(damageDetailsA2.tailHpLeft).toBe(2);
    expect(damageDetailsA2.isDamageFatal).toBe(false);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsA2.finalDamage);

    expect(attackedGroup.count).toBe(5);
    expect(attackedGroup.tailUnitHp).toBe(2);

    // group B deals damage
    const { damageFinalDetails: damageDetailsB } = getDamageDetails(attackingGroupB, attackedGroup);

    expect(damageDetailsB.finalDamage).toBe(6);
    expect(damageDetailsB.tailHpLeft).toBe(6);
    expect(damageDetailsB.finalUnitLoss).toBe(1);
    expect(damageDetailsB.isDamageFatal).toBe(false);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsB.finalDamage);

    expect(attackedGroup.count).toBe(4);
    expect(attackedGroup.tailUnitHp).toBe(6);

    // group C deals damage
    const { damageFinalDetails: damageDetailsC } = getDamageDetails(attackingGroupC, attackedGroup);

    expect(damageDetailsC.finalDamage).toBe(16);
    expect(damageDetailsC.tailHpLeft).toBe(10);
    expect(damageDetailsC.finalUnitLoss).toBe(2);
    expect(damageDetailsC.isDamageFatal).toBe(false);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsC.finalDamage);

    expect(attackedGroup.count).toBe(2);
    expect(attackedGroup.tailUnitHp).toBe(10);

    // group C deals damage again
    const { damageFinalDetails: damageDetailsC2 } = getDamageDetails(attackingGroupC, attackedGroup);

    expect(damageDetailsC2.finalDamage).toBe(16);
    expect(damageDetailsC2.tailHpLeft).toBe(4);
    expect(damageDetailsC2.finalUnitLoss).toBe(1);
    expect(damageDetailsC2.isDamageFatal).toBe(false);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsC2.finalDamage);

    expect(attackedGroup.count).toBe(1);
    expect(attackedGroup.tailUnitHp).toBe(4);

    // group B deals damage
    const { damageFinalDetails: damageDetailsB2 } = getDamageDetails(attackingGroupB, attackedGroup);

    expect(damageDetailsB2.finalDamage).toBe(6);
    expect(damageDetailsB2.tailHpLeft).toBe(0);
    expect(damageDetailsB2.finalUnitLoss).toBe(1);
    expect(damageDetailsB2.isDamageFatal).toBe(true);

    unitState.dealPureDamageToUnitGroup(attackedGroup, damageDetailsB2.finalDamage);

    expect(attackedGroup.count).toBe(0);
    expect(attackedGroup.tailUnitHp).toBe(0);
  });

});
