import { Component, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type TypedSignalInput = (
  | { type: 'checkbox'; value: WritableSignal<boolean> }
  | { type: 'number'; value: WritableSignal<number> }
  | { type: 'text'; value: WritableSignal<string> }
) & { min?: number };

export function typedNumberSignal(val: number): TypedSignalInput {
  return { type: 'number', value: signal(val) };
}
export function typedBooleanSignal(val: boolean): TypedSignalInput {
  return { type: 'checkbox', value: signal(val) };
}
export function typedTextSignal(val: string): TypedSignalInput {
  return { type: 'text', value: signal(val) };
}

@Component({
  selector: 'mw-editor-typed-signal-input',
  imports: [FormsModule],
  templateUrl: './editor-typed-signal-input.component.html',
  styleUrl: './editor-typed-signal-input.component.scss',
})
export class EditorTypedSignalInputComponent {
  readonly typedSignal = input.required<TypedSignalInput>();
}
