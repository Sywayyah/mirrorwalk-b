
// all here is experimental

export interface Location {
  towns: object[];
  structures: object[];
  name: string;
}

export interface LocationGenerator {
  type: string;
  generate(params: { stage: number }): Location;
}

const GreenHills: LocationGenerator = {
  type: 'GreenHills',

  generate({ stage }) {

    return {
      name: 'Green Hills',
      structRelations: [],
      structures: [],
      towns: [],
    };
  }
};

// location description:
//  2 resources, 3-rd is 50%
//  1-2 neutral hiring structures
//  3-4 neutral guards (experience)
//  1-2 castle hiring structures
//  1 magic school
//  2-3 places of interest

// patterns
//  res -> guards -> magic school
//  guard -> hiring
//  guard -> 2 free attachments (up to level 3)
//  pattern-name ( guard -> high-level hire )
//  res -> guards -> pattern-name

const patterns = [
  {
    id: 'weak-guard-1',
    type: 'guard',
    guards: 'guards-1',
  },
  {
    id: 'gold-mine-1',
    type: 'mine',
    resources: { gold: 250 },
    daysInterval: 2,
  },
  {
    id: 'basic-hire-1',
    type: 'hire',
    hired: [{
      type: 'Archer',
      count: 10,
    }],
  },
  {
    id: 'basic-pof-1',
    type: 'fountain',
    provide: { maxMana: 2, manaReplenish: 5 },
  },
  {
    id: 'army-join-1',
    type: 'join',
    hired: [
      { type: 'Cavalry', count: 1 },
    ],
  },
  {
    id: 'resource',
    type: 'res-pile',
    resources: { wood: 2 },
  },
  {
    id: 'chain-1',
    chain: [
      ['weak-guards-1', 'gold-mine-1'],
      ['weak-guards-1', ['basic-hire', 'magic-school']],
      ['res-pile', ['guards', '']],
    ],
  }
];

function goldMine(gold: number, interval: number): void { }

function guard(guards: object): void { }

function resPile(resType: 'wood', amount: number): void { }

const chain = {
  structs: {
    woodPile: resPile('wood', 2),
    weakGuard: guard([]),
  },
  chains: {
    1: [['woodPile', 'normalGuard->0,2'], 'weakGuard', 'resPile'],
    2: ['normalGuard', 'magicSchool'],
  },
};

// kinda need to think more.. need to imagine more scenarios and analyse them
// need to come up with some locations that I would want to end up with
// and see, how to describe it..
// there can be valuable resources on the edges of map, like crystals and other stuff

// medium guard: has 3 points for structures after it
