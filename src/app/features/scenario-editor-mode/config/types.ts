import { signal } from '@angular/core';
import { SpellActivationType } from 'src/app/core/spells';

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

export class CustomHeroDefinition {
  static counter = 0;
  readonly id = `custom_hero_${CustomHeroDefinition.counter}`;
  readonly assetUrl = signal('heroes/hero-melee.png');
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

// scenarios persistance, export (entire scenario, individual aspects, like triggers, map generators, etc.)

export interface SavedScenarioLocalStorageModel {
  id: string;
  name: string;
  locations: object[];
  customSpells: SavedSpellLocalStorageModel[];
  customEntities: object[];
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
