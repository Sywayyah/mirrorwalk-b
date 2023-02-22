import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellInstance, SpellActivationType } from 'src/app/core/spells';

@Component({
  selector: 'mw-spell-button',
  templateUrl: './mw-spell-button.component.html',
  styleUrls: ['./mw-spell-button.component.scss']
})
export class MwSpellButtonComponent {

  @Input()
  public spell!: SpellInstance;

  @Input()
  public onCooldown = false;

  @Input()
  public disabled = false;

  @Input()
  public isActive = false;

  @Input()
  public player!: PlayerInstanceModel;

  @Input()
  public hero!: Hero;

  @Output()
  public clicked = new EventEmitter<SpellInstance>();

  public activationTypes = SpellActivationType;

  constructor() { }

  public onClick(): void {
    this.clicked.emit(this.spell);
  }
}
