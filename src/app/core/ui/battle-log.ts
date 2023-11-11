import { UnitBaseType } from 'src/app/core/unit-types';
import { Player } from '../players';


export enum HistoryLogTypesEnum {
  SimpleMsg = 'simple-msg',
  RoundInfoMsg = 'round-info-msg',
  DealtDamageMsg = 'dealt-damage-msg',
  Html = 'html',
}

export interface HistoryLogModel<T extends HistoryLogTypesEnum = HistoryLogTypesEnum> {
  type: T;
}

export interface SimpleMessage extends HistoryLogModel<HistoryLogTypesEnum.SimpleMsg> {
  message: string;
}

export interface HtmlMessage extends HistoryLogModel<HistoryLogTypesEnum.Html> {
  message: string;
}

export interface RoundInfoMessage extends HistoryLogModel<HistoryLogTypesEnum.RoundInfoMsg> {
  message: string;
}

export interface DealtDamageMessage extends HistoryLogModel<HistoryLogTypesEnum.DealtDamageMsg> {
  attackingPlayer: Player;
  attackedPlayer: Player;
  attacker: UnitBaseType;
  attacked: UnitBaseType;
  attackersNumber: number;
  attackedNumber: number;
  losses: number;
  damageBlocked: number;
  damage: number;

  stolenLife: number;
  stolenLifeUnitsRestored: number;
  isCritical: boolean;
}
