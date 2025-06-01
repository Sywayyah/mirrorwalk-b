import { signal } from '@angular/core';
import { PropertyList } from '../../shared/components/editors-ui/editor-property/editor-property.component';
import {
  typedColorSignal,
  typedNumberSignal,
  typedTextSignal,
} from '../../shared/components/editors-ui/editor-typed-signal-input/editor-typed-signal-input.component';

export class GameArea {
  private static counter = 0;
  readonly locations = signal([]);

  properties = new PropertyList({
    Width: typedNumberSignal(100),
    Height: typedNumberSignal(100),
    Name: typedTextSignal(`Game_Area_${GameArea.counter}`),
    Color: typedColorSignal('red'),
  });

  constructor() {
    GameArea.counter++;
  }
}
