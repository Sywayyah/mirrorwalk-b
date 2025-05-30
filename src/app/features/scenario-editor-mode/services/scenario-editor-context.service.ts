import { Injectable, signal } from '@angular/core';
import { EffectAnimation } from 'src/app/core/api/vfx-api';
import { EntitiesRegisty } from 'src/app/core/entities';
import { ItemBaseType } from 'src/app/core/items';
import { SpellBaseType } from 'src/app/core/spells';
import { UnitBaseType } from 'src/app/core/unit-types';
import {
  CustomHeroDefinition,
  CustomItemDefinition,
  CustomSpellDefinition,
  CustomUnitDefinition,
  SavedScenarioLocalStorageModel,
  ScenarioScript,
} from '../config/types';

@Injectable()
export class ScenarioEditorContextService {
  readonly entitiesRegistries = EntitiesRegisty;

  readonly unitTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#unit') as UnitBaseType[];
  readonly itemTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#item') as ItemBaseType[];
  readonly spellTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#spell') as SpellBaseType[];
  readonly vfxTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#vfx') as EffectAnimation[];

  readonly customDefinitions = {
    units: signal<CustomUnitDefinition[]>([]),
    spells: signal<CustomSpellDefinition[]>([]),
    heroes: signal<CustomHeroDefinition[]>([]),
    items: signal<CustomItemDefinition[]>([]),
  } as const;

  readonly scriptsEditor = {
    scripts: signal([] as ScenarioScript[]),
    selectedScript: signal(null as ScenarioScript | null),
  } as const;

  // entity inspector
  readonly entitiesInspector = {
    selectedUnitType: signal(null as UnitBaseType | null),
    selectedItemType: signal(null as ItemBaseType | null),
    selectedSpellType: signal(null as SpellBaseType | null),
    selectedVFX: signal(null as EffectAnimation | null),
    selectedCustomSpellType: signal(null as CustomSpellDefinition | null),
  } as const;

  readonly selectedScenario = signal(null as SavedScenarioLocalStorageModel | null);
  readonly currentScenarioName = signal('');

  // entities manager
  readonly entitiesManager = {
    selectedUnitDefinition: signal<CustomUnitDefinition | null>(null),
    selectedHeroDefinition: signal<CustomHeroDefinition | null>(null),
    selectedSpellDefinition: signal<CustomSpellDefinition | null>(null),
    selectedItemDefinition: signal<CustomItemDefinition | null>(null),
  } as const;
}
