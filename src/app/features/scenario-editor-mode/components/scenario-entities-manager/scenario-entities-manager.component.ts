import { Component, input, model, signal } from '@angular/core';
import {
  ACTIVATION_TYPE_OPTIONS,
  ActivationTypeOption,
  CustomHeroDefinition,
  CustomSpellDefinition,
  CustomUnitDefinition,
  EntityTabs,
  ScenarioScript,
} from '../../config/types';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { DropdownOptionComponent } from '../../../shared/components/dropdown/dropdown-option.component';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mw-scenario-entities-manager',
  imports: [DropdownComponent, DropdownOptionComponent, FormsModule],
  templateUrl: './scenario-entities-manager.component.html',
  styleUrl: './scenario-entities-manager.component.scss',
})
export class ScenarioEntitiesManagerComponent {
  readonly scripts = input<ScenarioScript[]>([]);

  readonly customUnitDefinitions = model<CustomUnitDefinition[]>([]);
  readonly customSpellsDefinitions = model<CustomSpellDefinition[]>([]);
  readonly customHeroDefinitions = model<CustomHeroDefinition[]>([]);

  readonly selectedUnitDefinition = signal<CustomUnitDefinition | null>(null);
  readonly selectedHeroDefinition = signal<CustomHeroDefinition | null>(null);
  readonly selectedSpellDefinition = signal<CustomSpellDefinition | null>(null);

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
}
