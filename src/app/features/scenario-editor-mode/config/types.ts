import { computed, signal, WritableSignal } from '@angular/core';
import { Modifiers } from 'src/app/core/modifiers';
import { Resources } from 'src/app/core/resources';
import { SpellActivationType } from 'src/app/core/spells';
import { SignalArrUtils } from 'src/app/core/utils/signals';

export class Scenario {
  readonly id = crypto.randomUUID();
  readonly name = signal('');
  readonly locations = signal([]);
  readonly namedScripts = signal([]);
}

export enum ScriptType {
  TargetedSpell,
  Trigger,
  InstantSpell,
}

export class ScenarioScript {
  static counter = 0;
  readonly id = `custom_script_${ScenarioScript.counter}`;
  readonly name = signal(`New_Script_${ScenarioScript.counter}`);
  readonly type = signal(SCRIPT_TYPE_OPTIONS[0]);
  readonly code = signal('');

  constructor(id?: string) {
    ScenarioScript.counter++;
    if (id) {
      this.id = id;
    }
  }

  static fromSaved(saved: SavedScriptLocalStorageModel): ScenarioScript {
    const newScript = new ScenarioScript(saved.id);

    newScript.code.set(saved.code);
    newScript.name.set(saved.name);
    newScript.type.set(SCRIPT_TYPE_OPTIONS.find((option) => option.value === saved.type)!);
    return newScript;
  }
}

export class CustomUnitDefinition {
  static counter = 0;
  readonly id = `custom_unit_${CustomUnitDefinition.counter}`;
  readonly name = signal(`New_Unit_Type_${CustomUnitDefinition.counter}`);
  readonly level = signal(1);
  readonly health = signal(10);
  readonly damage = signal(5);

  constructor(id?: string) {
    CustomHeroDefinition.counter++;
    if (id) {
      this.id = id;
    }
  }
}

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

export class CustomResources {
  readonly gold = signal(100);
  readonly wood = signal(0);
  readonly gems = signal(0);
  readonly crystals = signal(0);

  constructor({ gold = 0, gems = 0, redCrystals = 0, wood = 0 }: Resources = {}) {
    this.gold.set(gold);
    this.wood.set(wood);
    this.gems.set(gems);
    this.crystals.set(redCrystals);
  }
}

export class CustomItemDefinition {
  static counter = 0;
  readonly id = `custom_item_${CustomUnitDefinition.counter}`;
  readonly name = signal(`New_Item_Type_${CustomUnitDefinition.counter}`);
  readonly icon = signal('book');

  readonly modifiers = new CustomModifiers();
  readonly resources = new CustomResources({ gold: 100 });

  constructor(id?: string) {
    CustomItemDefinition.counter++;
    if (id) {
      this.id = id;
    }
  }
}

export class CustomHeroDefinition {
  static counter = 0;
  readonly id = `custom_hero_${CustomHeroDefinition.counter}`;
  readonly assetUrl = signal('assets/heroes/hero-melee.png');
  readonly name = signal(`New_Hero_Type_${CustomHeroDefinition.counter}`);
  readonly spells = signal<CustomSpellDefinition[]>([]);
  readonly items = signal([]);
  readonly army = signal([]);

  readonly maxMana = signal(10);
  readonly defence = signal(1);
  readonly attack = signal(1);
  readonly initialGold = signal(1000);
  readonly initialWood = signal(1);
  readonly initialGems = signal(0);
  readonly initialCrystals = signal(0);

  constructor(id?: string) {
    CustomHeroDefinition.counter++;
    if (id) {
      this.id = id;
    }
  }

  static fromSaved(
    saved: SavedHeroLocalStorageModel,
    context: { spells: CustomSpellDefinition[] },
  ): CustomHeroDefinition {
    const heroDefinition = new CustomHeroDefinition(saved.id);

    heroDefinition.name.set(saved.name);
    heroDefinition.attack.set(saved.attack);
    heroDefinition.defence.set(saved.defence);
    heroDefinition.assetUrl.set(saved.assetUrl);

    heroDefinition.spells.set(
      saved.spellIds.map((spellId) => context.spells.find((spellDef) => spellDef.id === spellId)!),
    );

    heroDefinition.initialGold.set(saved.gold);
    heroDefinition.initialWood.set(saved.wood);
    heroDefinition.initialGems.set(saved.gems);
    heroDefinition.initialCrystals.set(saved.crystals);

    return heroDefinition;
  }
}

export class CustomSpellDefinition {
  static counter = 0;
  readonly id = `custom_spell_${CustomSpellDefinition.counter}`;
  readonly name = signal(`New_Spell_Type_${CustomSpellDefinition.counter}`);
  readonly activationType = signal(ACTIVATION_TYPE_OPTIONS[0]);
  readonly icon = signal('book');
  readonly connectedScript = signal<null | ScenarioScript>(null);

  constructor(id?: string) {
    CustomSpellDefinition.counter++;
    if (id) {
      this.id = id;
    }
  }

  static fromSaved(saved: SavedSpellLocalStorageModel, scripts: ScenarioScript[]): CustomSpellDefinition {
    const newSpell = new CustomSpellDefinition(saved.id);
    newSpell.name.set(saved.name);
    newSpell.icon.set(saved.icon);
    newSpell.connectedScript.set(scripts.find((script) => script.id === saved.linkedScriptId) ?? null);
    newSpell.activationType.set(ACTIVATION_TYPE_OPTIONS.find((option) => option.value === saved.activationType)!);

    return newSpell;
  }
}

export enum EntityTabs {
  UnitTypes = 'Units',
  Items = 'Items',
  Spells = 'Spells',
  Heroes = 'Heroes',
  Locations = 'Locations',
  Factions = 'Factions',
  Towns = 'Towns',
}

export interface SavedScriptLocalStorageModel {
  id: string;
  name: string;
  code: string;
  type: ScriptType;
}

export type SavedSpellLocalStorageModel = {
  id: string;
  name: string;
  icon: string;
  activationType: SpellActivationType;
  linkedScriptId?: string;
};

interface SavedHeroLocalStorageModel {
  id: string;
  name: string;
  assetUrl: string;

  attack: number;
  defence: number;
  maxMana: number;
  gold: number;
  wood: number;
  gems: number;
  crystals: number;

  spellIds: string[];
  itemIds: string[];
}

// scenarios persistance, export (entire scenario, individual aspects, like triggers, map generators, etc.)

export interface SavedScenarioLocalStorageModel {
  id: string;
  name: string;
  locations: object[];
  customSpells: SavedSpellLocalStorageModel[];
  customEntities: object[];
  customHeroes: SavedHeroLocalStorageModel[];
  customScripts: SavedScriptLocalStorageModel[];
}

export interface Option<T> {
  label: string;
  value: T;
}

export interface ActivationTypeOption extends Option<SpellActivationType> {
  label: string;
}

export interface ScriptTypeOption extends Option<ScriptType> {}

export const SCRIPT_TYPE_OPTIONS: ScriptTypeOption[] = [
  { label: 'Targeted Spell Script', value: ScriptType.TargetedSpell },
  { label: 'Instant Spell Script', value: ScriptType.InstantSpell },
  { label: 'Trigger Spell', value: ScriptType.Trigger },
];

export const ACTIVATION_TYPE_OPTIONS: ActivationTypeOption[] = [
  {
    label: 'Targetable',
    value: SpellActivationType.Target,
  },
  {
    label: 'Instant',
    value: SpellActivationType.Instant,
  },
  {
    label: 'Passive',
    value: SpellActivationType.Passive,
  },
  {
    label: 'Buff',
    value: SpellActivationType.Buff,
  },
  {
    label: 'Debuff',
    value: SpellActivationType.Debuff,
  },
];
