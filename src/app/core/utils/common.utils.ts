import { PlayerInstanceModel, UnitGroupInstModel, UnitGroupModel, UnitTypeModel } from "../model/main.model";

export interface GenerationModel {
    minUnitGroups: number;
    maxUnitGroups: number;
    /* unit type, min, max, maxGroupsOfThisType */
    units: [UnitTypeModel, number, number, number | void][];
}

export const CommonUtils = {
    randIndex<T>(array: Array<T>): number {
        return Math.round((array.length - 1) * Math.random());
    },

    randItem<T>(array: Array<T>): T {
        return array[this.randIndex(array)];
    },

    randIntInRange(from: number, to: number): number {
        const diff = to - from;

        return Math.round(from + (diff * Math.random()));
    },

    randIntTo(to: number): number {
        return Math.round(to * Math.random());
    },

    removeItem<T>(arr: T[], item: T): void {
        const itemIndex = arr.indexOf(item);
        arr.splice(itemIndex, 1);
    },

    randBoolean(): boolean {
        return Math.random() > 0.5;
    }

};

export const GenerationUtils = {
    createRandomArmy(options: GenerationModel): UnitGroupModel[] {
        const groupsToGenerateCount = CommonUtils.randIntInRange(options.minUnitGroups, options.maxUnitGroups);
        const generatedGroups = [];

        const unitsMap = options.units.reduce((unitGroupsMap, description) => {
            const [unitType, min, max, maxGroupsOfThisType = Infinity] = description;
            unitGroupsMap.set(description, {
                unitType,
                min,
                max,
                maxGroupsOfThisType,
                created: 0,
            });

            return unitGroupsMap;
        }, new Map());

        for (let i = 0; i < groupsToGenerateCount; i++) {
            const randUnitDescr = CommonUtils.randItem(options.units);
            const unit = unitsMap.get(randUnitDescr);
            const unitType = unit.unitType;

            const count = CommonUtils.randIntInRange(unit.min, unit.max);
            const newUnitGroup: UnitGroupModel = {
                count: count,
                type: unitType,
                turnsLeft: unitType.defaultTurnsPerRound,
                fightInfo: {
                    initialCount: count,
                    isAlive: true,
                },
            };

            generatedGroups.push(newUnitGroup);

            unit.created++;
            if (unit.created >= unit.maxGroupsOfThisType) {
                console.log('this unit was generated max times')
                unitsMap.delete(unit);
                options.units = options.units.filter(item => item !== randUnitDescr);
            }
        }


        console.log('generated groups', generatedGroups);

        return generatedGroups;
    },

    createRandomArmyForPlayer(options: GenerationModel, player: PlayerInstanceModel): UnitGroupInstModel[] {
        return this.createRandomArmy(options).map((unitGroup: UnitGroupModel) => {
            unitGroup.ownerPlayerRef = player;
            return unitGroup as UnitGroupInstModel;
        });
    }
}