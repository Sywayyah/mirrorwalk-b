import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { Player } from 'src/app/core/players';
import { Spell, SpellActivationType } from 'src/app/core/spells';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-spell-button',
  templateUrl: './mw-spell-button.component.html',
  styleUrls: ['./mw-spell-button.component.scss']
})
export class MwSpellButtonComponent {

  @Input()
  public spell!: Spell;

  @Input()
  public onCooldown = false;

  @Input()
  public disabled = false;

  @Input()
  public isActive = false;

  @Input()
  public player!: Player;

  @Input()
  public hero!: Hero;

  @Input()
  public hintPos: HintAttachment = 'above';

  @Output()
  public clicked = new EventEmitter<Spell>();

  public activationTypes = SpellActivationType;

  constructor() { }

  public onClick(): void {
    this.clicked.emit(this.spell);
  }
}
