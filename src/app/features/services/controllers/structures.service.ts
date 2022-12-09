import { Injectable } from '@angular/core';
import { StoreClient, WireMethod } from 'src/app/store';
import { NeutralStructParams, StructCompleted } from '../events';
import { MwStructuresService } from '../mw-structures.service';

@Injectable()
export class StructuresController extends StoreClient() {

  constructor(
    private structuresService: MwStructuresService,
  ) {
    super();
  }

  @WireMethod(StructCompleted)
  public handleCompletedStructure(event: NeutralStructParams): void {
    this.structuresService.availableStructuresMap[event.struct.id] = true;
    this.structuresService.playerCurrentLocId = event.struct.id;
    this.structuresService.updateAvailableLocs();
  }

}
