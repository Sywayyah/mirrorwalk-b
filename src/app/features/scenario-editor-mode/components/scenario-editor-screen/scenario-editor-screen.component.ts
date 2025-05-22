import { Component, computed, inject, signal } from '@angular/core';
import { EntitiesRegisty } from 'src/app/core/entities';
import { GameOpenMainScreen } from 'src/app/core/events';
import { ItemBaseType } from 'src/app/core/items';
import { UnitBaseType } from 'src/app/core/unit-types';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { EventsService } from 'src/app/store';

interface Scenario {
  name: string;
  locations: object[];
  customEntites: object;
  namedScripts: Record<string, ScenarioScript>;
}

let counter = 0;
class ScenarioScript {
  type = signal('SpellScript');
  name = signal(`New_Script_${counter++}`);
  code = signal('');
}

@Component({
  selector: 'mw-scenario-editor-screen',
  standalone: false,

  templateUrl: './scenario-editor-screen.component.html',
  styleUrl: './scenario-editor-screen.component.scss',
})
export class ScenarioEditorScreenComponent {
  readonly scenarios = signal<Scenario[]>([
    { name: 'Default Scenario', locations: [], customEntites: [], namedScripts: {} },
  ]);

  private readonly events = inject(EventsService);

  readonly entitiesRegistries = EntitiesRegisty;

  readonly unitTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#unit') as UnitBaseType[];
  readonly itemTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#item') as ItemBaseType[];

  readonly scripts = signal([] as ScenarioScript[]);

  readonly selectedUnitType = signal(null as string | null);
  readonly selectedItemType = signal(null as string | null);
  readonly selectedScenario = signal(null as string | null);
  readonly selectedScript = signal(null as string | null);

  readonly activeScript = computed(() => this.scripts().find((script) => script.name() === this.selectedScript()));

  addNewScript(): void {
    const newScript = new ScenarioScript();
    this.scripts.update(SignalArrUtils.addItem(newScript));
    this.selectedScript.set(newScript.name());
  }

  goToMainScreen() {
    this.events.dispatch(GameOpenMainScreen());
  }
}
