import { Injectable, signal } from '@angular/core';
import { EffectAnimation } from 'src/app/core/api/vfx-api';
import { EntitiesRegisty } from 'src/app/core/entities';
import { ItemBaseType } from 'src/app/core/items';
import { SpellBaseType } from 'src/app/core/spells';
import { UnitBaseType } from 'src/app/core/unit-types';
import {
  CustomHeroDefinition,
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

  readonly customUnitDefinitions = signal<CustomUnitDefinition[]>([]);
  readonly customSpellsDefinitions = signal<CustomSpellDefinition[]>([]);
  readonly customHeroDefinitions = signal<CustomHeroDefinition[]>([]);

  readonly selectedScript = signal(null as ScenarioScript | null);

  readonly selectedUnitType = signal(null as UnitBaseType | null);
  readonly selectedItemType = signal(null as ItemBaseType | null);
  readonly selectedSpellType = signal(null as SpellBaseType | null);
  readonly selectedVFX = signal(null as EffectAnimation | null);
  readonly selectedCustomSpellType = signal(null as CustomSpellDefinition | null);
  readonly selectedScenario = signal(null as SavedScenarioLocalStorageModel | null);

  readonly currentScenarioName = signal('');
}
