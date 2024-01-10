import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InputsService {

  readonly keyPress$ = fromEvent<KeyboardEvent>(document, 'keyup');

  readonly escape$ = this.keyPress$.pipe(filter((event) => event.key === 'Escape'));

  constructor() { }
}
