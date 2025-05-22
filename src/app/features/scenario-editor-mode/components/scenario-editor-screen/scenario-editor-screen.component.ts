import { Component, inject, signal } from '@angular/core';
import { EntitiesRegisty } from 'src/app/core/entities';
import { GameOpenMainScreen } from 'src/app/core/events';
import { ItemBaseType } from 'src/app/core/items';
import { UnitBaseType } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-scenario-editor-screen',
  standalone: false,

  templateUrl: './scenario-editor-screen.component.html',
  styleUrl: './scenario-editor-screen.component.scss',
})
export class ScenarioEditorScreenComponent {
  private readonly events = inject(EventsService);

  readonly entitiesRegistries = EntitiesRegisty;

  readonly unitTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#unit') as UnitBaseType[];
  readonly itemTypes = this.entitiesRegistries.getRegisteredEntitiesMap().get('#item') as ItemBaseType[];

  readonly selectedUnitType = signal(null as string | null);

  goToMainScreen() {
    this.events.dispatch(GameOpenMainScreen());
  }
}
