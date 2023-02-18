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
    /*
      Important note: loading scripts by file protocol does seem to be impossible because
        of security policies.
    */
    /*
      it doesn't seem to work with dynamic values, for example from variable or input
      because likely webpack excludes unused imports

      now the big question is how game can be modded. Simplest way would be to clone
      repo and change whatever. But then the question, does it make sense to have
      resource packs of any kind.

      Ability to import mods/resource packs without changing codebase implies a couple of things.
      First of all, it should be js, because now it's completely runtime. Then types problem appears.
      In theory it can be solved with something like types package, then mod can be built with
      webpack or something, and imported.

      In general, it can actually be 2 separated concepts that can coexist: codebase modding and
      resource packs.

      Also, there can be a possible advantage of having resourcepacks: resources loading, so
      instead of loading everything all at once, this process can be distributed.
    */
    import('src/app/mods/mod').then((data) => {
      // import(this.textElem.nativeElement.value).then((data) => {
      console.log('loaded script successfully!', data);
    });
  }

  public loadScriptByPath(): void {
    var myScript = document.createElement('script');
    myScript.setAttribute('src', this.textElem.nativeElement.value);
    document.head.appendChild(myScript);
    // import(this.textElem.nativeElement.value).then((module) => {
      // console.log(module, 'loaded successfully!');
    // });
  }

}
