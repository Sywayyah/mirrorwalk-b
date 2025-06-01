import { Component, input, signal } from '@angular/core';
import {
  TypedSignalInput,
  EditorTypedSignalInputComponent,
} from '../editor-typed-signal-input/editor-typed-signal-input.component';

type EditorProperty = {
  name: string;
  typedSignal: TypedSignalInput;
};

export function declareProperty(name: string, typedSignal: TypedSignalInput): EditorProperty {
  return { name, typedSignal };
}

export class PropertyList<T extends Record<string, TypedSignalInput>> {
  private readonly props = signal<EditorProperty[]>([]);

  get properties(): EditorProperty[] {
    return this.props();
  }

  get propsMap(): T {
    return this.props().reduce((acc, next) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      acc[next.name as keyof T] = next.typedSignal as any;
      return acc;
    }, {} as T);
  }

  constructor(properties: T) {
    this.props.set(Object.entries(properties).map(([key, val]) => declareProperty(key, val)));
  }
}

@Component({
  selector: 'mw-editor-property',
  imports: [EditorTypedSignalInputComponent],
  templateUrl: './editor-property.component.html',
  styleUrl: './editor-property.component.scss',
})
export class EditorPropertyComponent<T extends Record<string, TypedSignalInput>> {
  readonly properties = input.required<PropertyList<T>>();
}
