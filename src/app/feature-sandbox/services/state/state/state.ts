import { inject, OnDestroy } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { EventsService } from "../events/events.service";
import { ClassMemberConfig, classMembersConfigs, classTypeMarker, ClassTypeMarkers } from "./config";


export function StoreClient() {
  return class implements OnDestroy {
    public static [classMembersConfigs]: ClassMemberConfig[] = [];

    public static [classTypeMarker]: ClassTypeMarkers = 'store';

    public events: EventsService = inject(EventsService);

    public destroyed$ = new Subject<void>();

    private plainSubscriptions = new Subscription();

    constructor() {
      const self = this as any;

      const ownConstructor = Object.getPrototypeOf(this).constructor;

      (ownConstructor[classMembersConfigs] as ClassMemberConfig[]).forEach((memberConfig) => {
        const event = memberConfig.event;
        // switch (memberConfig.type) {
        //   case "wire-prop":
        //     this.events.onEvent(memberConfig.event)
        //       .pipe(takeUntil(this.destroyed$))
        //       .subscribe((data) => {
        //         self[memberConfig.name](data);
        //       });
        // }

        if (memberConfig.type === 'wire-prop') {
          return;
        }

        const method = memberConfig.method;

        switch (memberConfig.type) {
          case 'wire':
            this.events.onEvent(event)
              .pipe(
                this.untilDestroyed.bind(self),
              )
              .subscribe(val => {
                method.apply(this, [val]);
              });
            break;
          case 'notify':
            this.events.onEvent(event)
              .pipe(
                this.untilDestroyed.bind(self),
              )
              .subscribe(() => {
                method.apply(this);
              });
            break;
          case 'subscribeEvent':
            const subscription: Subscription = method.apply(self, [this.events.onEvent(event)]);

            this.plainSubscriptions.add(subscription);

            break;
        }
      });
    }

    public ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
      this.plainSubscriptions.unsubscribe();
    }

    public untilDestroyed<T>(source$: Observable<T>): Observable<T> {
      return source$.pipe(
        takeUntil(this.destroyed$),
      );
    }
  };
}
