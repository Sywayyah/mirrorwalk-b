import { GameObject } from '../game-objects';
import { Player } from '../players';
import { NeutralRewardModel, StructureGeneratorModel } from '.';
import { UnitGroup } from '../unit-types';
import { Modifiers } from '../modifiers';

export interface StructureDescription {
  x: number;
  y: number;
  icon: string;
  id: string;
  pathTo?: string;
  struct?: StructureGeneratorModel;
  defenderStaticMods?: Modifiers;
  attackerStaticMods?: Modifiers;
  tags?: string[];
}

type SvgPath = {
  x: number;
  y: number;
  width: number;
  height: number;

  // path origin x,y
  ox: number;
  oy: number;

  // path target x,y
  tx: number;
  ty: number;
};

export interface ViewStructureCreationParams {
  x: number;
  y: number;

  generator?: StructureGeneratorModel;
  guardingPlayer?: Player;

  isRoot?: boolean;
  pathTo?: string;

  iconName: string;
}

// location/structure
export class MapStructure extends GameObject<ViewStructureCreationParams> {
  public static categoryId: string = 'structure';

  // Structure can have it's own name/descriptions, but if it doesn't, it will be
  // taken from this structure generator
  public name: string = '';
  public x: number = 0;
  public y: number = 0;

  public isRoot?: boolean;

  public pathTo?: string;

  public visited?: boolean;
  public parentStructs: Set<string> = new Set();

  public icon: string = '';

  public isInactive: boolean = false;

  public isCompleted: boolean = false;

  public guardingPlayer?: Player;

  // theoretically, reward can be programmed.
  // On the other hand, I can still have
  // this declarative approach.
  public reward?: NeutralRewardModel;

  public guard?: UnitGroup[];

  // can be considered as Base Type for location
  // question: Shouldn't there always be a generator?
  // root is the only location that doesn't seem to posses generator
  //  some dummy generator can be created for it I think...
  public generator?: StructureGeneratorModel;

  // visual path between locations
  // in the future, could be stored separately.
  public svg?: SvgPath;

  create({ iconName, x, y, isRoot, generator, guardingPlayer, pathTo }: ViewStructureCreationParams): void {
    this.x = x;
    this.y = y;
    this.icon = iconName;
    this.isRoot = isRoot;
    this.generator = generator;
    this.guardingPlayer = guardingPlayer;
    this.pathTo = pathTo;
  }
}
