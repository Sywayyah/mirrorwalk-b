import { UnitGroup } from '../../unit-types';

/* Think on better namings and structure for effects and animations */
export enum AnimationElementType {
  Icon,
  Html,
  Customizable,
}

export interface AnimationElement<T extends AnimationElementType = AnimationElementType> {
  type: T;
  id: string;
}

export interface AnimationIconElement extends AnimationElement<AnimationElementType.Icon> {
  icon: string;
}

export interface AnimationHtmlElement extends AnimationElement<AnimationElementType.Html> {
}

export interface AnimationCustomizableElement extends AnimationElement<AnimationElementType.Customizable> {
}

export interface EffectAnimation {
  elements: AnimationElement[];
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
  type?: FillMode,
  iterations?: number;
  skipDlClass?: boolean;
}

export interface CustomizableAnimationData {
  parts?: {
    type: string | 'plainPart';
    text: string | number;
    icon: string;
    color: string;
  }[];
  html?: string;
}

export interface CustomAnimationData {
  custom?: CustomizableAnimationData;
}

/*  replace data: object with normal type */
export interface VfxApi {
  createEffectForUnitGroup(target: UnitGroup, animation: EffectAnimation, options?: EffectOptions): void;
  createFloatingMessageForUnitGroup(target: UnitGroup, data: CustomizableAnimationData, options?: EffectOptions): void;
  createDroppingMessageForUnitGroup(
    id: string,
    data: CustomizableAnimationData,
    options?: EffectOptions
  ): void;
}
