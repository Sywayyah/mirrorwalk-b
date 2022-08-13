import { UnitGroupInstModel } from "../main.model";

/* Think on better namings and structure for effects and animations */
export interface EffectAnimation {
    elements: {
        id: string;
        icon: string;
    }[];
    elemsKeyframes: Record<string, Keyframe[]>;
    elemsDefaultStyles: Record<string, Record<string, unknown>>;
    config: {
        layout: 'default';
    };
}

export enum EffectType {
    VfxElement,
}

export interface Effect<T extends EffectType = EffectType> {
    type: T;
}

export interface VfxElemEffect extends Effect<EffectType.VfxElement> {
    animation: EffectAnimation;
}

export interface EffectPosition {
    left: number | null;
    top: number | null;
    right: number | null;
    bottom: number | null;
}

export interface EffectInstRef {
    id: number;
    vfx: Effect;

    offset: EffectPosition;
}

export interface EffectOptions {
    darkOverlay?: boolean;
    duration?: number;
}

export interface VfxApi {
    createEffectForUnitGroup(target: UnitGroupInstModel, animation: EffectAnimation, options: EffectOptions): void;
}