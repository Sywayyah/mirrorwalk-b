import { Injectable } from '@angular/core';
import { MwStructuresService } from '../mw-structures.service';
import { StoreClient } from '../store';

@Injectable()
export class StructuresController extends StoreClient() {

  constructor(
    private structuresService: MwStructuresService,
  ) {
    super();
  }

}
