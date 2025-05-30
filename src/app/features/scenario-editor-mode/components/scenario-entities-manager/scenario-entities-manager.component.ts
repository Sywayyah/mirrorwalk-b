import { Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { DropdownOptionComponent } from '../../../shared/components/dropdown/dropdown-option.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { SharedModule } from '../../../shared/shared.module';
import {
  ACTIVATION_TYPE_OPTIONS,
  ActivationTypeOption,
  CustomHeroDefinition,
  CustomSpellDefinition,
  CustomUnitDefinition,
  EntityTabs,
  ScenarioScript,
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
  readonly scripts = input<ScenarioScript[]>([]);
  readonly spellSelectedInInspector = input<CustomSpellDefinition | null>(null);

  readonly customUnitDefinitions = model<CustomUnitDefinition[]>([]);
  readonly customSpellsDefinitions = model<CustomSpellDefinition[]>([]);
  readonly customHeroDefinitions = model<CustomHeroDefinition[]>([]);

  readonly selectedUnitDefinition = this.scenarioEditorContext.entitiesManager.selectedUnitDefinition;
  readonly selectedHeroDefinition = this.scenarioEditorContext.entitiesManager.selectedHeroDefinition;
  readonly selectedSpellDefinition = this.scenarioEditorContext.entitiesManager.selectedSpellDefinition;

  readonly EntityTab = EntityTabs;

  readonly EntityTabs = [
    EntityTabs.UnitTypes,
    EntityTabs.Spells,
    EntityTabs.Items,
    EntityTabs.Heroes,
    EntityTabs.Locations,
    EntityTabs.Factions,
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

  removeSpellFromHero(spell: CustomSpellDefinition) {
    this.selectedHeroDefinition()?.spells.update(SignalArrUtils.removeItem(spell));
  }
}
