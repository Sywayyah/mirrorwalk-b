import { signal } from '@angular/core';

export class GameArea {
  private static counter = 0;
  readonly width = signal(100);
  readonly height = signal(100);
  readonly name = signal(`Game_Area_${GameArea.counter}`);
  readonly color = signal('red');

  readonly locations = signal([]);

  constructor() {
    GameArea.counter++;
  }
}
