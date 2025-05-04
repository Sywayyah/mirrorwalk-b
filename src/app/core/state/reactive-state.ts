import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/**
 * An interface that represents a state value combining rxjs BehaviorSubject and Angular signal.
 * */
interface IReactiveState<T> {
  readonly signal: Signal<T>;
  set(state: T): void;
  patch(state: T): void;
  /**
   * If signal is part of implementation - get() should be read from it, to enable UI reactivity
   * when reading from reactive state.
   */
  get(): T;
  updateWith(fn: (prevState: T) => T | void): T;
  /** will create new version of state with copy and new partial fields provided from this fn  */
  patchWith(fn: (prevState: T) => Partial<T> | void): T;
  /** automatically creates a shallow copy of previous state for you, it can be mutated */
  updateWithCopy(fn: (prevState: T) => Partial<T> | void): T;

  observe(): Observable<T>;
}

/**
 * Economy-based implementation that doesn't require state object to be immutable, instead
 * keeping immutable a state-wrapper object.
 *
 * It can be useful when you want an increased trust for state, or want to avoid recreation
 * of big objects or data-structures, like Arrays, Maps or Sets.
 */
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

  observe(): Observable<T> {
    return this.state$.pipe(map((state) => state.ref));
  }

  updateWith(fn: (prevState: T) => void | T): T {
    const prevState = this.state$.getValue().ref;

    const newState = fn(prevState) ?? prevState;

    return this.updateState(newState);
  }

  patchWith(fn: (prevState: T) => void | Partial<T>): T {
    const prevState = this.state$.getValue().ref;
    const newState = fn(prevState) ?? prevState;
    return this.updateState({ ...prevState, ...newState });
  }

  updateWithCopy(fn: (prevState: T) => void | Partial<T>): T {
    const copiedPrevState = { ...this.state$.getValue().ref };
    // mutates copied state
    fn(copiedPrevState);
    return this.updateState(copiedPrevState);
  }

  patch(state: Partial<T>): void {
    this.updateState({ ...this.state$.getValue().ref, ...state });
  }

  // get state from signal to make UI react to changes
  get(): T {
    return this._signal().ref;
  }
}

/**
 * Implementation that relies on state object being immutable, creating new object on each
 * change.
 */
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

  debug(message: string): void {
    this.observe()
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        console.log(message, state);
      });
  }

  // get state from signal to make UI react to changes
  get(): T {
    return this.signal();
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

  // provides a state from signal and returns transformed result
  mapGet<R>(fn: (val: T) => R): R {
    return fn(this.get());
  }

  updateWith(fn: (val: T) => T | void): T {
    const currentState = this.state$.getValue();
    const newState = fn(currentState) ?? currentState;

    this.updateState(newState);

    return newState;
  }

  patchWith(fn: (prevState: T) => void | Partial<T>): T {
    const prevState = this.state$.getValue();
    const newState = fn(prevState) ?? prevState;
    return this.updateState({ ...prevState, ...newState });
  }

  updateWithCopy(fn: (prevState: T) => void): T {
    const copiedPrevState = { ...this.state$.getValue() };
    // mutates copied state
    fn(copiedPrevState);
    return this.updateState(copiedPrevState);
  }

  observe(): Observable<T> {
    return this.state$;
  }

  pick<R>(fn: (state: T) => R): R {
    return fn(this.get());
  }

  select<R>(fn: (state: T) => R): Observable<R> {
    return this.observe().pipe(map(fn));
  }

  selectDistinct<R>(fn: (state: T) => R): Observable<R> {
    return this.select(fn).pipe(distinctUntilChanged());
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

// may I need some kind of states aggregator?
// like, whenever anything changes in any states, do something ?
// I'm not so sure to be honest...
