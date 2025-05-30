import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpellId } from 'src/app/core/entities';
import { GameOpenMainScreen, OpenNewGameScreen } from 'src/app/core/events';
import { humansFaction } from 'src/app/core/factions';
import { createSpell } from 'src/app/core/spells';
import { heroDescrElem } from 'src/app/core/ui';
import { CommonUtils } from 'src/app/core/utils';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { VfxElementComponent } from 'src/app/features/shared/components';
import { DropdownOptionComponent } from 'src/app/features/shared/components/dropdown/dropdown-option.component';
import { DropdownComponent } from 'src/app/features/shared/components/dropdown/dropdown.component';
import { ScriptEditorComponent } from 'src/app/features/shared/components/script-editor/script-editor.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { EventsService } from 'src/app/store';
import { PanelContainerComponent } from '../../../shared/components/editors-ui/panel-container/panel-container.component';
import { PanelComponent } from '../../../shared/components/editors-ui/panel/panel.component';
import {
  CustomHeroDefinition,
  CustomSpellDefinition,
  EntityTabs,
  SavedScenarioLocalStorageModel,
  ScenarioScript,
  SCRIPT_TYPE_OPTIONS,
  ScriptTypeOption,
} from '../../config/types';
import { ScenarioEditorContextService } from '../../services/scenario-editor-context.service';
import { ScenarioEntitiesManagerComponent } from '../scenario-entities-manager/scenario-entities-manager.component';
import { LocalDialogComponent } from '../../../shared/components/local-dialog/local-dialog.component';

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
    ScenarioEntitiesManagerComponent,
    LocalDialogComponent,
  ],

  templateUrl: './scenario-editor-screen.component.html',
  styleUrl: './scenario-editor-screen.component.scss',

  providers: [ScenarioEditorContextService],
})
export class ScenarioEditorScreenComponent {
  // adjust scenarios - make them remember counters and store main content inside an object
  // provide some metadata on root level
  private readonly events = inject(EventsService);
  private readonly scenarioEditorContext = inject(ScenarioEditorContextService);

  readonly scenarios = signal<SavedScenarioLocalStorageModel[]>([]);
  readonly activeTab = signal<EntityTabs>(EntityTabs.UnitTypes);

  readonly vfxElemRef = viewChild<VfxElementComponent>('vfxRef');

  readonly unitTypes = this.scenarioEditorContext.unitTypes;
  readonly itemTypes = this.scenarioEditorContext.itemTypes;
  readonly spellTypes = this.scenarioEditorContext.spellTypes;
  readonly vfxTypes = this.scenarioEditorContext.vfxTypes;

  readonly scripts = signal([] as ScenarioScript[]);

  readonly selectedUnitType = this.scenarioEditorContext.entitiesInspector.selectedUnitType;
  readonly selectedItemType = this.scenarioEditorContext.entitiesInspector.selectedItemType;
  readonly selectedSpellType = this.scenarioEditorContext.entitiesInspector.selectedSpellType;
  readonly selectedVFX = this.scenarioEditorContext.entitiesInspector.selectedVFX;
  readonly selectedCustomSpellType = this.scenarioEditorContext.entitiesInspector.selectedCustomSpellType;
  readonly selectedScenario = this.scenarioEditorContext.selectedScenario;
  readonly unconfirmedSelectedScenario = signal<null | SavedScenarioLocalStorageModel>(null);

  readonly ScriptTypes: ScriptTypeOption[] = SCRIPT_TYPE_OPTIONS;

  readonly currentScenarioName = this.scenarioEditorContext.currentScenarioName;
  readonly newScenarioName = signal('');
  readonly selectedScript = this.scenarioEditorContext.selectedScript;

  readonly customUnitDefinitions = this.scenarioEditorContext.customUnitDefinitions;
  readonly customSpellsDefinitions = this.scenarioEditorContext.customSpellsDefinitions;
  readonly customHeroDefinitions = this.scenarioEditorContext.customHeroDefinitions;

  constructor() {
    const savedScenarions = JSON.parse(localStorage.getItem('scenarios') as string) as SavedScenarioLocalStorageModel[];
    this.scenarios.set(savedScenarions ?? []);

    effect(() => {
      const vfxElem = this.vfxElemRef();
      const vfx = this.selectedVFX();

      if (!vfxElem || !vfx) {
        return;
      }

      vfxElem.clearAnimation();
      vfxElem.playAnimation(vfx, { iterations: Infinity });
    });
  }

  addNewScenario() {
    const newScenario: SavedScenarioLocalStorageModel = {
      customEntities: [],
      customScripts: [],
      customSpells: [],
      customHeroes: [],
      id: crypto.randomUUID() as string,
      locations: [] as object[],
      name: this.newScenarioName(),
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
    this.selectedScenario.set(scenario);

    this.selectedCustomSpellType.set(null);
    this.scenarioEditorContext.entitiesManager.selectedHeroDefinition.set(null);
    this.scenarioEditorContext.entitiesManager.selectedSpellDefinition.set(null);
    this.scenarioEditorContext.entitiesManager.selectedUnitDefinition.set(null);
    this.selectedScript.set(null);

    const scripts = scenario.customScripts.map((script) => ScenarioScript.fromSaved(script));
    this.scripts.set(scripts);
    this.customSpellsDefinitions.set(
      scenario.customSpells.map((spell) => CustomSpellDefinition.fromSaved(spell, scripts)),
    );

    this.customHeroDefinitions.set(
      (scenario.customHeroes ?? []).map((hero) =>
        CustomHeroDefinition.fromSaved(hero, { spells: this.customSpellsDefinitions() }),
      ),
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
      customHeroes: this.customHeroDefinitions().map((hero) => ({
        id: hero.id,
        name: hero.name(),
        assetUrl: hero.assetUrl(),

        maxMana: hero.maxMana(),
        attack: hero.attack(),
        defence: hero.defence(),

        gold: hero.initialGold(),
        wood: hero.initialWood(),
        gems: hero.initialGems(),
        crystals: hero.initialCrystals(),

        spellIds: hero.spells().map((spell) => spell.id),
        itemIds: [],
        // itemIds: hero.items.map(item => )
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
        id: `#spell-${spellDefinition.id}`,
        activationType: spellDefinition.activationType().value,
        name: spellDefinition.name(),
        icon: {
          icon: spellDefinition.icon(),
        },
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

    const newHeroes = this.customHeroDefinitions().map((heroDefinition, i) => {
      const spellIds = heroDefinition.spells().map((spell) => `#spell-${spell.id}`);
      return humansFaction.createHero({
        id: `#hero-${heroDefinition.id}`,
        name: heroDefinition.name(),
        items: [],
        abilities: spellIds as SpellId[],
        army: [{ minUnitGroups: 1, maxUnitGroups: 1, units: [['#unit-h00', 40, 40, 1]] }],
        generalDescription: heroDescrElem(''),
        image: heroDefinition.assetUrl(),
        stats: {
          baseAttack: heroDefinition.attack(),
          baseDefence: heroDefinition.defence(),
          mana: heroDefinition.maxMana(),
        },
        resources: {
          gems: heroDefinition.initialGems(),
          gold: heroDefinition.initialGold(),
          redCrystals: heroDefinition.initialCrystals(),
          wood: heroDefinition.initialWood(),
        },
      });
    });

    this.events.dispatch(OpenNewGameScreen());

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    // const helveticaHero = EntitiesRegisty.resolve('#hero-helvetica') as HeroBase;
    // newSpells.forEach((spell) => {
    //   helveticaHero.initialState.abilities.push(spell.id);
    // });
  }
}
