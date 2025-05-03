import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface IReactiveState<T> {
  readonly signal: Signal<T>;
  set(state: T): void;
  patch(state: T): void;
  get(): T;
  updateWith(fn: (prevState: T) => T | void): T;

  getStream(): Observable<T>;
}

export class ReactiveRefState<T extends object> implements IReactiveState<T> {
  private currentState: { ref: T };
  protected readonly state$: BehaviorSubject<{ ref: T }>;
  readonly _signal: WritableSignal<{ ref: T }>;
  readonly stateSignal: Signal<T>;

  get signal(): Signal<T> {
    return this.stateSignal;
  }

  constructor(protected readonly defaultState: T) {
    this.currentState = { ref: defaultState };
    this.state$ = new BehaviorSubject(this.currentState);
    this._signal = signal(this.currentState);
    this.stateSignal = computed(() => this._signal().ref);
  }

  private updateState(state: T): T {
    this.currentState = { ref: state };
    this.state$.next(this.currentState);
    this._signal.set(this.currentState);
    return state;
  }

  set(state: T): void {
    this.updateState(state);
  }

  getStream(): Observable<T> {
    return this.state$.pipe(map((state) => state.ref));
  }

  updateWith(fn: (prevState: T) => void | T): T {
    const prevState = this.state$.getValue().ref;

    const newState = fn(prevState) ?? prevState;

    return this.updateState(newState);
  }

  patch(state: Partial<T>): void {
    this.updateState({ ...this.state$.getValue().ref, ...state });
  }

  get(): T {
    return this.state$.getValue().ref;
  }
}

export class ReactiveState<T extends object> implements IReactiveState<T> {
  protected readonly state$: BehaviorSubject<T>;
  protected readonly _signal: WritableSignal<T>;

  get signal(): Signal<T> {
    return this._signal;
  }

  constructor(protected readonly defaultState: T) {
    this.state$ = new BehaviorSubject<T>(defaultState);
    this._signal = signal(defaultState);
  }

  get(): T {
    return this.state$.getValue();
  }

  patch(state: Partial<T>): T {
    return this.updateState({ ...this.state$.getValue(), ...state });
  }

  set(state: T): void {
    this.updateState(state);
  }

  revertState(): void {
    this.set(this.defaultState);
  }

  getState(): T {
    return this.state$.getValue();
  }

  updateWith(fn: (val: T) => T | void): T {
    const currentState = this.state$.getValue();
    const newState = fn(currentState) ?? currentState;

    this.updateState(newState);

    return newState;
  }

  getStream(): Observable<T> {
    return this.state$;
  }

  getStateSignal(): Signal<T> {
    return this._signal;
  }

  private updateState(state: T): T {
    this.state$.next(state);
    this._signal.set(state);
    return state;
  }
}

export class FeatureState<T extends object> extends ReactiveState<T> {
  revert(): void {
    this.set(this.defaultState);
  }
}

// const reactiveArray = new ReactiveRefState([1]);
// const reactiveState = new ReactiveState({
//   health: 100,
//   count: 0,
// });

// reactiveArray.updateWith((prev) => {
//   prev.push(5);
// });

// reactiveState.updateWith((val) => {
//   val.count = 5;
// });
