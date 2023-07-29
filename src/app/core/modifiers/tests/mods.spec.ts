import { ModsRefsGroup } from '../mods-group';
import { ModsRef } from '../mods-ref';

describe('Test mods cases', () => {
  it('is a test scenario #1 (ModsRef)', () => {
    const ref = ModsRef.fromMods({ amplifiedTakenMagicDamagePercent: 0.15 });

    expect(ref.getModValue('amplifiedTakenMagicDamagePercent')).toBe(0.15);

    ref.setModValue('amplifiedTakenMagicDamagePercent', 0.2);

    expect(ref.getModValue('amplifiedTakenMagicDamagePercent')).toBe(0.2);

    ref.addModValue('amplifiedTakenMagicDamagePercent', 0.1);

    expect(ref.getModValue('amplifiedTakenMagicDamagePercent')).toBe(0.30);

    ref.addModValue('amplifiedTakenMagicDamagePercent', -0.05);

    expect(ref.getModValue('amplifiedTakenMagicDamagePercent')).toBe(0.25);

    expect(ref.getModValue('resistAll')).toBe(null);

    ref.addModValue('resistAll', 10);

    expect(ref.getModValue('resistAll')).toBe(10);

    ref.addModValue('resistAll', -15);

    expect(ref.getModValue('resistAll')).toBe(-5);

    ref.clearMod('resistAll');

    expect(ref.getModValue('resistAll')).toBe(null);
  });

  it('is a test scenario #2 (ModsRefGroup)', () => {
    const refA = ModsRef.fromMods({ resistAll: 10 });
    const refB = ModsRef.fromMods({ resistAll: 5 });

    const refsGroup = ModsRefsGroup.empty();

    refsGroup.addModsRef(refA);
    refsGroup.addModsRef(refB);

    expect(refsGroup.getAllModValues('resistAll')).toEqual([10, 5]);

    expect(refsGroup.getModValue('resistAll')).toBe(15);

    const negativeResistRef = ModsRef.fromMods({ resistAll: -5 });

    refsGroup.addModsRef(negativeResistRef);

    expect(refsGroup.getAllModValues('resistAll')).toEqual([10, 5, -5]);

    expect(refsGroup.getModValue('resistAll')).toBe(10);

    refsGroup.removeModsRef(refB);

    expect(refsGroup.getCalcNumModValue('resistAll')).toBe(5);

    expect(refsGroup.getModValue('resistAll')).toBe(5);

    refsGroup.removeModsRef(negativeResistRef);

    expect(refsGroup.getModValue('resistAll')).toBe(10);
  });

  it('is a test scenario #3 (booleans)', () => {
    const refWithBool = ModsRef.fromMods({ isRanged: true });

    expect(refWithBool.getModValue('isRanged')).toBe(true);

    const refsGroup = ModsRefsGroup.empty();

    refsGroup.addModsRef(refWithBool);

    expect(refsGroup.getModValue('isRanged')).toBe(true);

    refsGroup.removeModsRef(refWithBool);

    expect(refsGroup.getModValue('isRanged')).toBe(null);
  });

  it('is a test scenario #4 (Combined Groups)', () => {
    const refWithBool = ModsRef.fromMods({ isRanged: true });
    const refWithNum = ModsRef.fromMods({ resistAll: 10 });

    const refsGroupA = ModsRefsGroup.empty();
    const refsGroupB = ModsRefsGroup.empty();

    refsGroupA.addModsRef(refWithBool);
    refsGroupB.addModsRef(refWithNum);

    const groupsCombined = ModsRefsGroup.empty();

    groupsCombined.attachParentGroup(refsGroupA);
    groupsCombined.attachParentGroup(refsGroupB);

    expect(groupsCombined.getModValue('isRanged')).toBe(true);
    expect(groupsCombined.getModValue('resistAll')).toBe(10);

    // add mods dynamically to the nested group
    const refWithNum2 = ModsRef.fromMods({ resistAll: 15 });

    refsGroupB.addModsRef(refWithNum2);

    expect(groupsCombined.getModValue('resistAll')).toBe(25);

    // removing group with resists completely
    groupsCombined.detachParentGroup(refsGroupB);

    expect(groupsCombined.getModValue('resistAll')).toBe(null);

    // Bring mods group back
    groupsCombined.attachParentGroup(refsGroupB);

    expect(groupsCombined.getModValue('resistAll')).toBe(25);
  });

  it('is a test scenario #5 (Named Groups)', () => {
    // two groups with some mods
    const refWithBool = ModsRef.fromMods({ isRanged: true });
    const refWithNum = ModsRef.fromMods({ resistAll: 10 });

    const refsGroupA = ModsRefsGroup.empty();
    const refsGroupB = ModsRefsGroup.empty();

    refsGroupA.addModsRef(refWithBool);
    refsGroupB.addModsRef(refWithNum);

    // group that is going to attach 2 previous as parents
    const groupsCombined = ModsRefsGroup.empty();

    groupsCombined.attachNamedParentGroup('parent-1', refsGroupA);
    groupsCombined.attachNamedParentGroup('parent-2', refsGroupB);

    // combined group inherits parential values
    expect(groupsCombined.getModValue('isRanged')).toBe(true);
    expect(groupsCombined.getModValue('resistAll')).toBe(10);

    // add mods dynamically to the combined group
    const refWithNum2 = ModsRef.fromMods({ resistAll: 15 });

    refsGroupB.addModsRef(refWithNum2);

    expect(refsGroupB.getModValue('resistAll')).toBe(25);
    expect(groupsCombined.getModValue('resistAll')).toBe(25);

    // removing group with resists completely
    groupsCombined.detachNamedParentGroup('parent-2');

    expect(groupsCombined.getModValue('resistAll')).toBe(null);

    // Bring mods group back
    groupsCombined.attachNamedParentGroup('parent-2', refsGroupB);

    expect(groupsCombined.getModValue('resistAll')).toBe(25);

    refsGroupB.removeModsRef(refWithNum2);

    expect(groupsCombined.getModValue('resistAll')).toBe(10);
  });

  it('is a test scenario #6 (Value Changes Subscribe)', () => {
    const baseGroup = ModsRefsGroup.empty();
    const fn = jasmine.createSpy();
    const subscription = baseGroup.onValueChanges().subscribe(fn);
    const mods = ModsRef.fromMods({ resistCold: 10 });

    baseGroup.addModsRef(mods);
    expect(fn).toHaveBeenCalledWith({ resistCold: 10 });

    const parentGroupA = ModsRefsGroup.empty();
    const parentModsA = ModsRef.fromMods({ resistCold: 5, resistFire: 5 });
    parentGroupA.addModsRef(parentModsA);

    baseGroup.attachNamedParentGroup('parent-a', parentGroupA);

    expect(fn).toHaveBeenCalledWith({ resistCold: 15, resistFire: 5 });

    const parentModsA2 = ModsRef.fromMods({ resistLightning: 5 });
    parentGroupA.addModsRef(parentModsA2);

    expect(fn).toHaveBeenCalledWith({ resistCold: 15, resistFire: 5, resistLightning: 5 });
    subscription.unsubscribe();
  });

  // maybe test more nested cases
});
