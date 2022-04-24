import { PlayerModel, UnitTypeModel } from 'src/app/core/model/main.model';


export enum HistoryLogTypesEnum {
  SimpleMsg = 'simple-msg',
  RoundInfoMsg = 'round-info-msg',
  DealtDamageMsg = 'dealt-damage-msg'
}

export interface HistoryMessageModel<T extends HistoryLogTypesEnum = HistoryLogTypesEnum> {
  type: T;
}

export interface SimpleMessage extends HistoryMessageModel<HistoryLogTypesEnum.SimpleMsg> {
  message: string;
}

export interface RoundInfoMessage extends HistoryMessageModel<HistoryLogTypesEnum.RoundInfoMsg> {
  message: string;
}

export interface DealtDamageMessage extends HistoryMessageModel<HistoryLogTypesEnum.DealtDamageMsg> {
  attackingPlayer: PlayerModel;
  attackedPlayer: PlayerModel;
  attacker: UnitTypeModel;
  attacked: UnitTypeModel;
  losses: number;
  damage: number;
}
