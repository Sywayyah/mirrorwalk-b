import { BanditCamp } from '../common';
import { getResPileParams, ResourcesPileStructure } from '../common/resource-pile';
import { StructureDescription } from '../map-structures';
import { createLocationsBranch } from '../utils';


const locCoord = (x: number, y: number) => ({ x: x + 1700, y: y + 1500 });


export const constellationSpawn: StructureDescription[] = createLocationsBranch('const-start', [
  {
    id: 'start',
    ...locCoord(0, 0),
    icon: 'campfire',
  },
  {
    id: '1',
    pathTo: 'start',
    ...locCoord(90, -60),
    icon: 'gold-bar',
    actionPoints: 2,
    struct: ResourcesPileStructure,
    structParams: getResPileParams({ gold: 650 }),
  },
  {
    id: '2',
    pathTo: 'start',
    ...locCoord(10, -70),
    icon: 'sword',
    struct: BanditCamp,
  }
]);
