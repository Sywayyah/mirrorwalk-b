import { CommonModule } from '@angular/common';
import { Component, contentChild, input, Signal, signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownOptionComponent } from '../../dropdown/dropdown-option.component';
import { DropdownComponent } from '../../dropdown/dropdown.component';

export type TypedSignalInput<T = unknown> =
  | { type: 'checkbox'; value: WritableSignal<boolean> }
  | { type: 'number'; value: WritableSignal<number>; min?: number }
  | { type: 'text'; value: WritableSignal<string> }
  | { type: 'dropdown'; value: WritableSignal<T>; values: Signal<T[]> }
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

export function typedDropdownSignal<T>(initValue: T, { values }: { values: Signal<T[]>; }): TypedSignalInput<T> {
  return { type: 'dropdown', value: signal(initValue), values };
}

export function typedColorSignal(initValue: string): TypedSignalInput {
  return { type: 'color', value: signal(initValue) };
}

@Component({
  selector: 'mw-editor-typed-signal-input',
  imports: [FormsModule, DropdownComponent, DropdownOptionComponent, CommonModule],
  templateUrl: './editor-typed-signal-input.component.html',
  styleUrl: './editor-typed-signal-input.component.scss',
})
export class EditorTypedSignalInputComponent {
  readonly typedSignal = input.required<TypedSignalInput>();

  readonly itemTemplate = contentChild<TemplateRef<{ item: unknown }>>('itemTemplate');
  readonly selectedTemplate = contentChild<TemplateRef<{ item: unknown }>>('selectedItemTemplate');
}
