import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-settings-popup',
  templateUrl: './settings-popup.component.html',
  styleUrls: ['./settings-popup.component.scss']
})
export class SettingsPopupComponent extends BasicPopup<{}> implements OnInit {
  @ViewChild('scriptPath')
  public textElem!: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }


  public loadScript(): void {
    /* Basic implementation for scripts loading! With that, there can be mods and resource packs. */
    // src/app/mods/mod
    const data = 'src/app/mods/mod';
    import('src/app/mods/mod').then((data) => {
      // import(this.textElem.nativeElement.value).then((data) => {
      console.log('loaded script successfully!', data);
    });
  }

}
