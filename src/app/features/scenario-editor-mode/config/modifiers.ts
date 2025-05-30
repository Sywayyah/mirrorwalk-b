import { signal, WritableSignal, computed } from '@angular/core';
import { Modifiers } from 'src/app/core/modifiers';
import { SignalArrUtils } from 'src/app/core/utils/signals';

type ModifierOption = {
  label: string;
  modifier: keyof CustomModifiers['modifiers'];
  inputType: 'text' | 'number' | 'checkbox';
};

export class CustomModifiers {
  readonly addedModifiers: (keyof CustomModifiers['modifiers'])[] = [];
  static readonly MODIFIERS_LIST: ModifierOption[] = [
    { label: 'Attack', modifier: 'heroBonusAttack', inputType: 'number' },
    { label: 'Defence', modifier: 'heroBonusDefence', inputType: 'number' },
    { label: 'Speed', modifier: 'unitGroupSpeedBonus', inputType: 'number' },
    { label: 'Max Mana', modifier: 'heroMaxMana', inputType: 'number' },
    { label: 'Resist All', modifier: 'resistAll', inputType: 'number' },
    {
      label: 'Amplified Taken Magic Damage Percent',
      modifier: 'amplifiedTakenMagicDamagePercent',
      inputType: 'number',
    },
    { label: 'Cannot Be Slowed', modifier: 'cannotBeSlowed', inputType: 'checkbox' },
  ];

  readonly modifiers = {
    heroBonusAttack: signal(0),
    heroBonusDefence: signal(0),
    unitGroupSpeedBonus: signal(0),
    heroMaxMana: signal(0),
    resistAll: signal(0),
    amplifiedTakenMagicDamagePercent: signal(0),
    cannotBeSlowed: signal(false),
    criticalDamageChance: signal(0),
    criticalDamageMul: signal(0),
  } satisfies Partial<Record<keyof Modifiers, WritableSignal<unknown>>>;

  readonly visibleModifiers = signal<ModifierOption[]>([]);
  readonly modifiersForm = computed(() =>
    // any to avoid type-checking problem in template
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.visibleModifiers().map((mod) => ({ ...mod, value: this.modifiers[mod.modifier] as any })),
  );

  readonly availableModifiers = computed(() =>
    CustomModifiers.MODIFIERS_LIST.filter((mod) => !this.visibleModifiers().includes(mod)),
  );

  addModifierOption(modifier: ModifierOption) {
    this.visibleModifiers.update(SignalArrUtils.addItem(modifier));
  }

  removeModifierOption(modifier: ModifierOption) {
    this.visibleModifiers.update(SignalArrUtils.removeItem(modifier));
  }
  removeModifierOptionByModName(modName: string) {
    this.visibleModifiers.update((modifiers) => modifiers.filter((mod) => mod.modifier !== modName));
  }
}
