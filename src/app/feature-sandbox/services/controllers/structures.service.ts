import { Injectable } from "@angular/core";
import { MwStructuresService } from "../mw-structures.service";
import { StoreClient, WireMethod } from "../state";
import { StructSelected, StructSelectedEvent } from "../state-values/game-events";


@Injectable()
export class StructuresController extends StoreClient() {

  constructor(
    private structuresService: MwStructuresService,
  ) {
    super();
  }

  @WireMethod(StructSelected)
  public onStructSelected(event: StructSelectedEvent): void {
    this.structuresService.currentStruct = event.struct;
  }
}
