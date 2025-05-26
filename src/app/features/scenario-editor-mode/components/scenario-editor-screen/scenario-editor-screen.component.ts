import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntitiesRegisty } from 'src/app/core/entities';
import { GameOpenMainScreen, OpenNewGameScreen } from 'src/app/core/events';
import { HeroBase } from 'src/app/core/heroes';
import { ItemBaseType } from 'src/app/core/items';
import { createSpell, SpellActivationType, SpellBaseType } from 'src/app/core/spells';
import { UnitBaseType } from 'src/app/core/unit-types';
import { CommonUtils } from 'src/app/core/utils';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { DropdownOptionComponent } from 'src/app/features/shared/components/dropdown/dropdown-option.component';
import { DropdownComponent } from 'src/app/features/shared/components/dropdown/dropdown.component';
import { ScriptEditorComponent } from 'src/app/features/shared/components/script-editor/script-editor.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { EventsService } from 'src/app/store';
import { PanelContainerComponent } from '../../../shared/components/editors-ui/panel-container/panel-container.component';
import { PanelComponent } from '../../../shared/components/editors-ui/panel/panel.component';

class Scenario {
  readonly id = crypto.randomUUID();
  readonly name = signal('');
  readonly locations = signal([]);
  readonly namedScripts = signal([]);
}

enum ScriptType {
  TargetedSpell,
  Trigger,
  InstantSpell,
}
class ScenarioScript {
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

let unitsCounter = 0;
class CustomUnitDefinition {
  readonly name = signal(`New_Unit_Type_${unitsCounter++}`);
  readonly level = signal(1);
  readonly health = signal(10);
  readonly damage = signal(5);
}

class CustomHeroDefinition {
  static counter = 0;
  readonly id = `custom_hero_${CustomHeroDefinition.counter}`;
  readonly assetUrl = signal('heroes/hero-melee.png');
  readonly name = signal(`New_Hero_Type_${CustomHeroDefinition.counter}`);
  readonly spells = signal<CustomSpellDefinition[]>([]);
  readonly items = signal([]);
  readonly army = signal([]);

  constructor(id?: string) {
    CustomHeroDefinition.counter++;
    if (id) {
      this.id = id;
    }
  }
}

class CustomSpellDefinition {
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

enum EntityTabs {
  UnitTypes = 'Units',
  Items = 'Items',
  Spells = 'Spells',
  Heroes = 'Heroes',
  Locations = 'Locations',
  Factions = 'Factions',
}
interface SavedScriptLocalStorageModel {
  id: string;
  name: string;
  code: string;
  type: ScriptType;
}

type SavedSpellLocalStorageModel = {
  id: string;
  name: string;
  icon: string;
  activationType: SpellActivationType;
  linkedScriptId?: string;
};

// scenarios persistance, export (entire scenario, individual aspects, like triggers, map generators, etc.)

interface SavedScenarioLocalStorageModel {
  id: string;
  name: string;
  locations: object[];
  customSpells: SavedSpellLocalStorageModel[];
  customEntities: object[];
  customScripts: SavedScriptLocalStorageModel[];
}

interface Option<T> {
  label: string;
  value: T;
}
interface ActivationTypeOption extends Option<SpellActivationType> {
  label: string;
}

interface ScriptTypeOption extends Option<ScriptType> {}

const SCRIPT_TYPE_OPTIONS: ScriptTypeOption[] = [
  { label: 'Targeted Spell Script', value: ScriptType.TargetedSpell },
  { label: 'Instant Spell Script', value: ScriptType.InstantSpell },
  { label: 'Trigger Spell', value: ScriptType.Trigger },
];

const ACTIVATION_TYPE_OPTIONS: ActivationTypeOption[] = [
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
@Component({
  selector: 'mw-scenario-editor-screen',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ScriptEditorComponent,
    PanelContainerComponent,
    PanelComponent,
    DropdownComponent,
    DropdownOptionComponent,
  ],

  templateUrl: './scenario-editor-screen.component.html',
  styleUrl: './scenario-editor-screen.component.scss',
})
export class ScenarioEditorScreenComponent {
  readonly scenarios = signal<SavedScenarioLocalStorageModel[]>([]);

  private readonly events = inject(EventsService);

  readonly EntityTabs = [
    EntityTabs.UnitTypes,
    EntityTabs.Spells,
    EntityTabs.Items,
    EntityTabs.Heroes,
    EntityTabs.Locations,
    EntityTabs.Factions,
  ];
  readonly EntityTab = EntityTabs;

  readonly activeTab = signal<EntityTabs>(EntityTabs.UnitTypes);

  readonly entitiesRegistries = EntitiesRegisty;

  readonly unitTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#unit') as UnitBaseType[];
  readonly itemTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#item') as ItemBaseType[];
  readonly spellTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#spell') as SpellBaseType[];

  readonly scripts = signal([] as ScenarioScript[]);

  readonly selectedUnitType = signal(null as UnitBaseType | null);
  readonly selectedItemType = signal(null as ItemBaseType | null);
  readonly selectedSpellType = signal(null as SpellBaseType | null);
  readonly selectedScenario = signal(null as SavedScenarioLocalStorageModel | null);

  readonly ActivationTypes: ActivationTypeOption[] = ACTIVATION_TYPE_OPTIONS;
  readonly ScriptTypes: ScriptTypeOption[] = SCRIPT_TYPE_OPTIONS;

  readonly currentScenarioName = signal('');
  readonly selectedScript = signal(null as ScenarioScript | null);

  readonly customUnitDefinitions = signal<CustomUnitDefinition[]>([]);
  readonly customSpellsDefinitions = signal<CustomSpellDefinition[]>([]);
  readonly customHeroDefinitions = signal<CustomHeroDefinition[]>([]);
  readonly selectedUnitDefinition = signal<CustomUnitDefinition | null>(null);
  readonly selectedHeroDefinition = signal<CustomHeroDefinition | null>(null);

  readonly selectedSpellDefinition = signal<CustomSpellDefinition | null>(null);

  constructor() {
    const savedScenarions = JSON.parse(localStorage.getItem('scenarios') as string) as SavedScenarioLocalStorageModel[];
    this.scenarios.set(savedScenarions ?? []);
  }

  addNewScenario() {
    const newScenario = {
      customEntities: [] as object[],
      customScripts: [] as SavedScriptLocalStorageModel[],
      customSpells: [] as SavedSpellLocalStorageModel[],
      id: crypto.randomUUID() as string,
      locations: [] as object[],
      name: 'New Custom Scenario',
    };
    this.scenarios.update(SignalArrUtils.addItem(newScenario));
    console.log(newScenario);

    this.onScenarioChanged(newScenario);
  }

  onScenarioChanged(scenario: SavedScenarioLocalStorageModel | null): void {
    console.log(scenario);
    if (!scenario) {
      return;
    }
    const scripts = scenario.customScripts.map((script) => ScenarioScript.fromSaved(script));
    this.scripts.set(scripts);
    this.customSpellsDefinitions.set(
      scenario.customSpells.map((spell) => CustomSpellDefinition.fromSaved(spell, scripts)),
    );
    this.currentScenarioName.set(scenario.name);
  }

  addNewScript(): void {
    const newScript = new ScenarioScript();
    this.scripts.update(SignalArrUtils.addItem(newScript));
    this.selectedScript.set(newScript);
  }

  goToMainScreen() {
    this.events.dispatch(GameOpenMainScreen());
  }

  runScripts() {
    this.scripts().forEach((script) => {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function(script.code());
      fn();
    });
  }

  addCustomUnitGroup() {
    const newDefinition = new CustomUnitDefinition();
    this.customUnitDefinitions.update(SignalArrUtils.addItem(newDefinition));
    this.selectedUnitDefinition.set(newDefinition);
    // if (!this.selectedUnitDefinition()) {
    // }
  }

  saveScenario() {
    const scenarios = this.scenarios();

    const selectedScenario = this.selectedScenario();
    if (!selectedScenario) {
      return;
    }

    const scenarioToBeSaved: SavedScenarioLocalStorageModel = {
      id: selectedScenario.id,
      name: this.currentScenarioName(),
      customEntities: [],
      customScripts: this.scripts().map((script) => ({
        code: script.code(),
        id: script.id,
        name: script.name(),
        type: script.type().value,
      })),
      customSpells: this.customSpellsDefinitions().map((spell) => ({
        id: spell.id,
        name: spell.name(),
        icon: spell.icon(),
        activationType: spell.activationType().value,
        linkedScriptId: spell.connectedScript()?.id,
      })),
      locations: [],
    };

    const wasPresent = CommonUtils.removeItem(scenarios, scenarioToBeSaved);

    if (!wasPresent) {
      scenarios.push(scenarioToBeSaved);
    }

    const wasPresentAmongExisting = CommonUtils.removeItemWith(
      this.scenarios(),
      (scenario) => scenario.id === scenarioToBeSaved.id,
    );

    if (!wasPresentAmongExisting) {
      this.scenarios.update(SignalArrUtils.addItem(scenarioToBeSaved));
    }

    localStorage.setItem('scenarios', JSON.stringify(scenarios));
  }

  addCustomSpellType() {
    const newDefinition = new CustomSpellDefinition();
    this.customSpellsDefinitions.update(SignalArrUtils.addItem(newDefinition));
    this.selectedSpellDefinition.set(newDefinition);
  }

  addNewHero() {
    const newDefinition = new CustomHeroDefinition();
    this.customHeroDefinitions.update(SignalArrUtils.addItem(newDefinition));
    this.selectedHeroDefinition.set(newDefinition);
  }

  testScenario() {
    const newSpells = this.customSpellsDefinitions().map((spellDefinition, i) => {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function(
        'events',
        'actions',
        'spellInstance',
        'target',
        spellDefinition.connectedScript()?.code() || '',
      );

      return createSpell({
        activationType: spellDefinition.activationType().value,
        name: spellDefinition.name(),
        icon: {
          icon: spellDefinition.icon(),
        },
        id: `#spell-custom-${i}`,
        getDescription() {
          return { descriptions: ['Custom Ability', spellDefinition.name()] };
        },
        config: {
          init({ events, actions, spellInstance }) {
            events.on({
              PlayerTargetsSpell({ target }) {
                fn(events, actions, spellInstance, target);
              },
            });
          },
        },
      });
    });

    this.events.dispatch(OpenNewGameScreen());

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const helveticaHero = EntitiesRegisty.resolve('#hero-helvetica') as HeroBase;
    newSpells.forEach((spell) => {
      helveticaHero.initialState.abilities.push(spell.id);
    });
  }
}
