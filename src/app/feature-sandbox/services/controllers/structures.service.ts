import { Injectable } from "@angular/core";
import { MwStructuresService } from "../";
import { StoreClient } from "../state";


@Injectable()
export class StructuresController extends StoreClient() {

  constructor(
    private structuresService: MwStructuresService,
  ) {
    super();
  }

}
