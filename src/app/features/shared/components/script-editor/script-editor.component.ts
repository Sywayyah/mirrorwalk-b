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

    editorElement.textContent = this.code();

    this.jar = CodeJar(
      editorElement,
      (editor) => {
        // highlight.js requires the text to be in a <code> tag inside the <pre>
        // if you want to use highlightElement().
        // CodeJar manages the content inside the <pre> for you.
        // So, you usually just highlight the content directly using highlight().
        editor.innerHTML = hljs.highlight(editor.textContent || '', {
          language: 'javascript',
        }).value;
      },
      {
        tab: '  ', // 2 spaces for tab
        preserveIdent: true,
        addClosing: false,
        history: true,
      },
    );

    // Listen for updates from CodeJar
    this.jar.onUpdate((newCode) => {
      this.code.set(newCode);
    });
  }

  ngOnChanges(): void {
    if (this.jar) {
      // this.jar.updateCode(this.code());
      if (this.jar.toString() !== this.code()) {
        this.jar.updateCode(this.code());
      }
    }
  }

  ngOnDestroy() {
    if (this.jar) {
      this.jar.destroy();
    }
  }
}
