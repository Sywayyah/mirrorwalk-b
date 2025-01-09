import { Component } from '@angular/core';
import { UnitsOrientation } from 'src/app/core/ui';
import { State } from 'src/app/features/services/state.service';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
    selector: 'mw-settings-popup',
    templateUrl: './settings-popup.component.html',
    styleUrls: ['./settings-popup.component.scss'],
    standalone: false
})
export class SettingsPopupComponent extends BasicPopup<{}> {
  // @ViewChild('scriptPath')
  // public textElem!: ElementRef;

  public orientation = UnitsOrientation;

  public orientationOptions = [
    {
      label: 'Vertical',
      value: UnitsOrientation.Vertical,
    },
    {
      label: 'Horizontal',
      value: UnitsOrientation.Horizontal,
    },
  ];

  public settings = this.state.settings;

  constructor(
    private state: State,
  ) {
    super();
  }

  public setOrientation(orientation: UnitsOrientation): void {
    this.state.settings.orientation = orientation;
  }

  public loadScript(): void {
    /* Basic implementation for scripts loading! With that, there can be mods and resource packs. */
    // src/app/mods/mod
    /*
      Important note #1: loading scripts by file protocol does seem to be impossible because
        of security policies.

      Important note #2: Even if script is going to be loaded from http, probably the
      only effective way it will be able to communicate with current script is
      via global window object.

      Important note #3: Another possible approach is through file dialog and window object
        interaction. When I select a file, it it loaded into browser and it can be transformed
        into text, then executed via adding <script> tag. As a meaning of communication,
        window can be used.

        Although it might be not so convenient, and not everything might be
        possible with that approach, but still.

        One thing that bothers the most is that it seems to be not very easy
        to include multiple files with this.

      Important note #4: In addition to #3. Theoretically, files limitation can
        be overcome with zip archives and JSZip library. It looks like
        people pretty much use it for uploading images and stuff like that,
        JsZip itself seems to have pretty convincing api, for example
        ability to navigate inside folder, stuff like that.

      Important note #5: Theoretically, I can try to play with Webpack imports.
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
    import('src/app/playground/mod').then((data) => {
      // import(this.textElem.nativeElement.value).then((data) => {
      console.log('loaded script successfully!', data);
    });
  }

  public loadScriptByPath(): void {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;

    input.onchange = e => {
      var file = (e as any).target.files[0];
      console.log(file);

      // setting up the reader
      var reader = new FileReader();
      reader.readAsText(file); // this is reading as data url

      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
        var content = (readerEvent as any).target.result; // this is the content!
        console.log(content);
        var myScript = document.createElement('script');
        myScript.innerHTML = content;
        myScript.setAttribute('type', 'module');
        document.head.appendChild(myScript);
        // (document.querySelector('#content')! as any).style.backgroundImage = 'url(' + content + ')';
      }
    }

    input.click();
    // import(this.textElem.nativeElement.value).then((module) => {
    // console.log(module, 'loaded successfully!');
    // });
  }

}
