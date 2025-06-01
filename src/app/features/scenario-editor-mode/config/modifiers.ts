import { computed, signal } from '@angular/core';
import { Modifiers } from 'src/app/core/modifiers';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import {
  typedBooleanSignal,
  typedNumberSignal,
  TypedSignalInput,
} from '../../shared/components/editors-ui/editor-typed-signal-input/editor-typed-signal-input.component';

type ModifierOption = {
  label: string;
  modifier: keyof CustomModifiers['modifiers'];
};

export class CustomModifiers {
  readonly addedModifiers: (keyof CustomModifiers['modifiers'])[] = [];
  static readonly MODIFIERS_LIST: ModifierOption[] = [
    { label: 'Attack', modifier: 'heroBonusAttack' },
    { label: 'Defence', modifier: 'heroBonusDefence' },
    { label: 'Speed', modifier: 'unitGroupSpeedBonus' },
    { label: 'Max Mana', modifier: 'heroMaxMana' },
    { label: 'Resist All', modifier: 'resistAll' },
    {
      label: 'Amplified Taken Magic Damage Percent',
      modifier: 'amplifiedTakenMagicDamagePercent',
    },
    { label: 'Cannot Be Slowed', modifier: 'cannotBeSlowed' },
  ];

  readonly modifiers = {
    heroBonusAttack: typedNumberSignal(0),
    heroBonusDefence: typedNumberSignal(0),
    unitGroupSpeedBonus: typedNumberSignal(0),
    heroMaxMana: typedNumberSignal(0),
    resistAll: typedNumberSignal(0),
    amplifiedTakenMagicDamagePercent: typedNumberSignal(0),
    cannotBeSlowed: typedBooleanSignal(false),
    criticalDamageChance: typedNumberSignal(0),
    criticalDamageMul: typedNumberSignal(0),
  } satisfies Partial<Record<keyof Modifiers, TypedSignalInput>>;

  readonly visibleModifiers = signal<ModifierOption[]>([]);
  readonly modifiersForm = computed(() =>
    this.visibleModifiers().map((mod) => ({
      modName: mod.modifier,
      label: mod.label,
      value: this.modifiers[mod.modifier],
    })),
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
