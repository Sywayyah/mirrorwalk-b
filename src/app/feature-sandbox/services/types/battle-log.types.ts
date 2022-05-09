import { PlayerModel, UnitTypeModel } from 'src/app/core/model/main.model';


export enum HistoryLogTypesEnum {
  SimpleMsg = 'simple-msg',
  RoundInfoMsg = 'round-info-msg',
  DealtDamageMsg = 'dealt-damage-msg'
}

export interface HistoryLogModel<T extends HistoryLogTypesEnum = HistoryLogTypesEnum> {
  type: T;
}

export interface SimpleMessage extends HistoryLogModel<HistoryLogTypesEnum.SimpleMsg> {
  message: string;
}

export interface RoundInfoMessage extends HistoryLogModel<HistoryLogTypesEnum.RoundInfoMsg> {
  message: string;
}

export interface DealtDamageMessage extends HistoryLogModel<HistoryLogTypesEnum.DealtDamageMsg> {
  attackingPlayer: PlayerModel;
  attackedPlayer: PlayerModel;
  attacker: UnitTypeModel;
  attacked: UnitTypeModel;
  losses: number;
  damage: number;
}
