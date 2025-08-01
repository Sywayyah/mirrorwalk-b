import { CommonModule } from '@angular/common';
import { Component, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type TypedSignalInput =
  | { type: 'checkbox'; value: WritableSignal<boolean> }
  | { type: 'number'; value: WritableSignal<number>; min?: number }
  | { type: 'text'; value: WritableSignal<string> }
  | { type: 'color'; value: WritableSignal<string> };

export function typedNumberSignal(initValue: number): TypedSignalInput {
  return { type: 'number', value: signal(initValue) };
}

export function typedBooleanSignal(initValue: boolean): TypedSignalInput {
  return { type: 'checkbox', value: signal(initValue) };
}

export function typedTextSignal(initValue: string): TypedSignalInput {
  return { type: 'text', value: signal(initValue) };
}

export function typedColorSignal(initValue: string): TypedSignalInput {
  return { type: 'color', value: signal(initValue) };
}

@Component({
  selector: 'mw-editor-typed-signal-input',
  imports: [FormsModule, CommonModule],
  templateUrl: './editor-typed-signal-input.component.html',
  styleUrl: './editor-typed-signal-input.component.scss',
})
export class EditorTypedSignalInputComponent {
  readonly typedSignal = input.required<TypedSignalInput>();
}
