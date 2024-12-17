import { AfterViewInit, Component, OnInit, forwardRef, input, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { json } from '@codemirror/lang-json';
import { ViewUpdate } from '@codemirror/view';
import * as CodeMirror from 'codemirror';

export type CodeEditorMode = 'json';

@Component({
  selector: 'jee-code-editor',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi: true
    }
  ],
  template: `<div #editorHolder style="height: 100%;overflow:hidden"></div>`
})
export class CodeEditorComponent implements OnInit, ControlValueAccessor {
  readonly editorHolder = viewChild<any>('editorHolder');

  readonly mode = input<CodeEditorMode>('json');

  readonly lineNumbers = input<boolean>(true);

  readonly readonly = input<boolean>(false);

  private _code: string;

  onTouched: () => void;
  onChanged: (v) => void;

  codeMirror: CodeMirror.EditorView;

  ngOnInit(): void {
    const editorHolder = this.editorHolder();
    console.log(editorHolder);

    this.codeMirror = new CodeMirror.EditorView({
      parent: editorHolder.nativeElement,
      extensions: [
        CodeMirror.basicSetup,
        json(),
        CodeMirror.EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged) {
            this._code = v.state.doc.toString();
            if (this.onChanged) {
              this.onChanged(this._code);
            }
          }
        })
      ]
    });
  }

  initCodeMirror(): void {
    this.codeMirror.dispatch({
      changes: {
        from: 0,
        to: this.codeMirror.state.doc.length,
        insert: this._code
      }
    });

    // this.codeMirrorInstance = CodeMirror.(
    //   this.editorHolder.nativeElement,
    //   {
    //     value: this._code ? this._code : "",
    //     mode: this.mode,
    //     lineNumbers: this.lineNumbers
    //   }
    // );

    // this.codeMirrorInstance.on("change", (inst, obj) => {
    //   if (inst.doc.getValue() !== this._code) {
    //     this._code = inst.doc.getValue();
    //     if (this.onChanged) {
    //       this.onChanged(this._code);
    //     }
    //   }
    // });
  }

  writeValue(str: string): void {
    if (str !== this._code) {
      this._code = str;
      this.initCodeMirror();
      //this.codeMirror.doc.setValue(this._code);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    //this.readonly = isDisabled;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
}
