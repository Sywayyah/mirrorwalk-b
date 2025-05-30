import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { DropdownOptionComponent } from '../../../shared/components/dropdown/dropdown-option.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { SharedModule } from '../../../shared/shared.module';
import {
  ACTIVATION_TYPE_OPTIONS,
  ActivationTypeOption,
  CustomHeroDefinition,
  CustomItemDefinition,
  CustomSpellDefinition,
  CustomUnitDefinition,
  EntityTabs,
} from '../../config/types';
import { ScenarioEditorContextService } from '../../services/scenario-editor-context.service';

@Component({
  selector: 'mw-scenario-entities-manager',
  imports: [DropdownComponent, DropdownOptionComponent, FormsModule, SharedModule],
  templateUrl: './scenario-entities-manager.component.html',
  styleUrl: './scenario-entities-manager.component.scss',
})
export class ScenarioEntitiesManagerComponent {
  readonly scenarioEditorContext = inject(ScenarioEditorContextService);

  readonly scripts = this.scenarioEditorContext.scriptsEditor.scripts;
  readonly spellSelectedInInspector = this.scenarioEditorContext.entitiesInspector.selectedCustomSpellType;

  readonly customUnitDefinitions = this.scenarioEditorContext.customDefinitions.units;
  readonly customSpellsDefinitions = this.scenarioEditorContext.customDefinitions.spells;
  readonly customHeroDefinitions = this.scenarioEditorContext.customDefinitions.heroes;
  readonly customItemDefinitions = this.scenarioEditorContext.customDefinitions.items;

  readonly selectedUnitDefinition = this.scenarioEditorContext.entitiesManager.selectedUnitDefinition;
  readonly selectedHeroDefinition = this.scenarioEditorContext.entitiesManager.selectedHeroDefinition;
  readonly selectedSpellDefinition = this.scenarioEditorContext.entitiesManager.selectedSpellDefinition;
  readonly selectedItemDefinition = this.scenarioEditorContext.entitiesManager.selectedItemDefinition;

  readonly EntityTab = EntityTabs;

  readonly EntityTabs = [
    EntityTabs.UnitTypes,
    EntityTabs.Spells,
    EntityTabs.Items,
    EntityTabs.Heroes,
    EntityTabs.Locations,
    EntityTabs.Factions,
    EntityTabs.Towns,
  ];

  readonly ActivationTypes: ActivationTypeOption[] = ACTIVATION_TYPE_OPTIONS;

  readonly activeTab = signal<EntityTabs>(EntityTabs.UnitTypes);

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

  addNewHero() {
    const newDefinition = new CustomHeroDefinition();
    this.customHeroDefinitions.update(SignalArrUtils.addItem(newDefinition));
    this.selectedHeroDefinition.set(newDefinition);
  }

  addSpellFromInspector() {
    const spellFromInspector = this.spellSelectedInInspector();
    if (!spellFromInspector) {
      return;
    }

    this.selectedHeroDefinition()?.spells.update(SignalArrUtils.addItem(spellFromInspector));
  }

  addItemType() {
    const newItemDefinition = new CustomItemDefinition();
    this.customItemDefinitions.update(SignalArrUtils.addItem(newItemDefinition));
    this.selectedItemDefinition.set(newItemDefinition);
  }

  removeSpellFromHero(spell: CustomSpellDefinition) {
    this.selectedHeroDefinition()?.spells.update(SignalArrUtils.removeItem(spell));
  }
}
