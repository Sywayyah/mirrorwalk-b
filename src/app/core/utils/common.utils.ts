import { UnitGroupModel, UnitTypeModel } from "../model/main.model";


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

};

export const RandomUtils = {
    createRandomArmy(options: {
        fraction: Record<string, UnitTypeModel>,
        minUnitGroups: number,
        maxUnitGroups: number,
        /* unit type, min, max, maxGroupsOfThisType */
        units: [string, number, number, number | void][],
    }): UnitGroupModel[] {
        const groupsToGenerateCount = CommonUtils.randIntInRange(options.minUnitGroups, options.maxUnitGroups);
        const generatedGroups = [];

        const unitsMap = options.units.reduce((map, description) => {
            const [unitType, min, max, maxGroupsOfThisType = Infinity] = description;
            map.set(description, {
                unitType,
                min,
                max,
                maxGroupsOfThisType,
                created: 0,
            });

            return map;
        }, new Map());

        for (let i = 0; i < groupsToGenerateCount; i++) {
            const randUnitDescr = CommonUtils.randItem(options.units);
            const unit = unitsMap.get(randUnitDescr);
            const newUnitGroup: UnitGroupModel = {
                count: CommonUtils.randIntInRange(unit.min, unit.max),
                type: options.fraction[unit.unitType],
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
}