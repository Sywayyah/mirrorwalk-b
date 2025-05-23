import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntitiesRegisty } from 'src/app/core/entities';
import { GameOpenMainScreen } from 'src/app/core/events';
import { ItemBaseType } from 'src/app/core/items';
import { UnitBaseType } from 'src/app/core/unit-types';
import { SignalArrUtils } from 'src/app/core/utils/signals';
import { ScriptEditorComponent } from 'src/app/features/shared/components/script-editor/script-editor.component';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { EventsService } from 'src/app/store';

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

// scenarios persistance, export (entire scenario, individual aspects, like triggers, map generators, etc.)

@Component({
  selector: 'mw-scenario-editor-screen',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, ScriptEditorComponent],

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

  runScripts() {
    this.scripts().forEach((script) => {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function(script.code());
      fn();
    });
  }
}
