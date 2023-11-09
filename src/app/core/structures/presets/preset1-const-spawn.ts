import { ResourceType } from '../../resources';
import { BanditCamp } from '../common';
import { resPileStructure } from '../common/resource-pile';
import { StructureDescription } from '../map-structures';


const locCoord = (x: number, y: number) => ({ x: x + 1700, y: y + 1500 });

const id = (id: string) => `const-${id}`;

export const constellationSpawn: StructureDescription[] = [
  {
    id: id('start-1'),
    ...locCoord(0, 0),
    icon: 'campfire',
  },
  {
    id: id('loc-1'),
    pathTo: id('start-1'),
    ...locCoord(90, -60),
    icon: 'gold-bar',
    struct: resPileStructure(ResourceType.Gold, 650),
  },
  {
    id: id('loc-2'),
    pathTo: id('start-1'),
    ...locCoord(10, -70),
    icon: 'sword',
    struct: BanditCamp,
  }
];
