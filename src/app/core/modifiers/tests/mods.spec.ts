import { ModsRef, ModsRefsGroup } from '../mods';

describe('Test mods cases', () => {
  it('is a basic test', () => {
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

    const refGroup = ModsRefsGroup.empty();

    refGroup.addModsRef(ref);

    refGroup.removeModsRef(ref);

  });
});
