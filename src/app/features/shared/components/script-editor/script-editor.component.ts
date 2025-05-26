import { Component, ElementRef, model, OnChanges, OnDestroy, OnInit, viewChild } from '@angular/core';
import { CodeJar } from 'codejar';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

@Component({
  selector: 'mw-script-editor',
  template: `
    <div class="code-editor-wrapper">
      <pre
        #editorContainer
        class="language-javascript"
      ></pre>
    </div>
  `,
  styleUrls: ['./script-editor.component.scss'],
})
export class ScriptEditorComponent implements OnInit, OnDestroy, OnChanges {
  readonly editorContainer = viewChild.required<ElementRef>('editorContainer');
  readonly code = model('');

  private jar!: CodeJar;

  ngOnInit() {
    const editorElement = this.editorContainer().nativeElement as HTMLElement;
    const initialCode = this.code();

    editorElement.textContent = initialCode;

    this.jar = CodeJar(
      editorElement,
      (editor) => {
        editor.innerHTML = hljs.highlight(editor.textContent || '', {
          language: 'javascript',
        }).value;
      },
      {
        tab: '  ',
        preserveIdent: true,
        addClosing: false,
        history: true,
      },
    );

    // highlight first code if provided via input
    if (initialCode) {
      editorElement.innerHTML = hljs.highlight(initialCode, {
        language: 'javascript',
      }).value;
    }

    this.jar.onUpdate((newCode) => {
      this.code.set(newCode);
    });
  }

  ngOnChanges(): void {
    if (this.jar) {
      if (this.jar.toString() !== this.code()) {
        this.jar.updateCode(this.code());
        this.jar.save();
      }
    }
  }

  ngOnDestroy() {
    if (this.jar) {
      this.jar.destroy();
    }
  }
}
