import { StructureGeneratorModel, StuctureControl } from "../../model/structures.types";


export const MagicRiverStructure: StructureGeneratorModel = {
    control: StuctureControl.Neutral,
    name: 'Magic River',
    description: 'Walking near magic river, you feel your magical powers restored.\n\n+4 to mana and +2 to max mana',

    onVisited: ({ playersApi: api, visitingPlayer }) => {
        api.addMaxManaToPlayer(visitingPlayer, 2);
        api.addManaToPlayer(visitingPlayer, 4);
    },
};
