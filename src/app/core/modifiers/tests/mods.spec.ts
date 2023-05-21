import { ModsRef, ModsRefsGroup } from '../mods';

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
});
