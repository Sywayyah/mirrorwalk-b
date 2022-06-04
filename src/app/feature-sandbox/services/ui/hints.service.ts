import { Injectable } from "@angular/core";
import type { HintsContainerComponent } from "../../components/ui-elements/hints-container/hints-container.component";


@Injectable({
    providedIn: 'root',
})
export class HintsService {

    public containerRef!: HintsContainerComponent;

}