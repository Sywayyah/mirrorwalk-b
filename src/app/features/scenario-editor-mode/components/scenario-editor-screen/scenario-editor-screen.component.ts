import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntitiesRegisty } from 'src/app/core/entities';
import { GameOpenMainScreen, OpenNewGameScreen } from 'src/app/core/events';
import { HeroBase } from 'src/app/core/heroes';
import { ItemBaseType } from 'src/app/core/items';
import { createSpell, SpellActivationType, SpellBaseType } from 'src/app/core/spells';
import { UnitBaseType } from 'src/app/core/unit-types';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { DropdownOptionComponent } from 'src/app/features/shared/components/dropdown/dropdown-option.component';
import { DropdownComponent } from 'src/app/features/shared/components/dropdown/dropdown.component';
import { ScriptEditorComponent } from 'src/app/features/shared/components/script-editor/script-editor.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { EventsService } from 'src/app/store';
import { PanelContainerComponent } from '../../../shared/components/editors-ui/panel-container/panel-container.component';
import { PanelComponent } from '../../../shared/components/editors-ui/panel/panel.component';

interface Scenario {
  name: string;
  locations: object[];
  customEntites: object;
  namedScripts: Record<string, ScenarioScript>;
}

let counter = 0;
enum ScriptType {
  Spell,
  Trigger,
}
class ScenarioScript {
  readonly type = signal(ScriptType.Spell);
  readonly name = signal(`New_Script_${counter++}`);
  readonly code = signal('');
}

let unitsCounter = 0;
class CustomUnitDefinition {
  readonly name = signal(`New_Unit_Type_${unitsCounter++}`);
  readonly level = signal(1);
  readonly health = signal(10);
  readonly damage = signal(5);
}

let spellsCounter = 0;

class CustomSpellDefinition {
  readonly name = signal(`New_Spell_Type_${spellsCounter++}`);
  readonly activationType = signal(SpellActivationType.Target);
  readonly icon = signal('book');
  readonly connectedScript = signal<null | ScenarioScript>(null);
}

enum EntityTabs {
  UnitTypes = 'Units',
  Items = 'Items',
  Spells = 'Spells',
  Heroes = 'Heroes',
  Locations = 'Locations',
  Factions = 'Factions',
}
// scenarios persistance, export (entire scenario, individual aspects, like triggers, map generators, etc.)

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
  readonly scenarios = signal<Scenario[]>([
    { name: 'Default Scenario', locations: [], customEntites: [], namedScripts: {} },
  ]);

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
  readonly selectedScenario = signal(null as Scenario | null);
  readonly selectedScript = signal(null as ScenarioScript | null);

  readonly customUnitDefinitions = signal<CustomUnitDefinition[]>([]);
  readonly selectedUnitDefinition = signal<CustomUnitDefinition | null>(null);

  readonly customSpellsDefinitions = signal<CustomSpellDefinition[]>([]);
  readonly selectedSpellDefinition = signal<CustomSpellDefinition | null>(null);
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

  addCustomSpellType() {
    const newDefinition = new CustomSpellDefinition();
    this.customSpellsDefinitions.update(SignalArrUtils.addItem(newDefinition));
    this.selectedSpellDefinition.set(newDefinition);
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
        activationType: spellDefinition.activationType(),
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
