import { Injectable } from '@angular/core';
import { StoreClient } from 'src/app/store';
import { MwStructuresService } from '../mw-structures.service';

@Injectable()
export class StructuresController extends StoreClient() {

  constructor(
    private structuresService: MwStructuresService,
  ) {
    super();
  }

}
