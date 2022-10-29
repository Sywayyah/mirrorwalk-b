import { Injectable } from "@angular/core";
import { MwStructuresService } from "../";
import { StructSelected, StructSelectedEvent } from "../events";
import { StoreClient, WireMethod } from "../state";


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
