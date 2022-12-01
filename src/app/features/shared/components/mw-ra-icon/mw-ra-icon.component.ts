import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mw-ra-icon',
  templateUrl: './mw-ra-icon.component.html',
  styleUrls: ['./mw-ra-icon.component.scss']
})
export class MwRaIconComponent implements OnInit {

  @Input() public icon!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
