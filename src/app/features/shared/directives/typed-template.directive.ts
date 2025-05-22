import { Directive, Input } from '@angular/core';

@Directive({ selector: 'ng-template[mwTypedTemplate]', standalone: false })
export class TypedTemplateDirective<TypeToken> {
  @Input('mwTypedTemplate')
  typeToken!: TypeToken;

  static ngTemplateContextGuard<TypeToken>(dir: TypedTemplateDirective<TypeToken>, ctx: unknown): ctx is TypeToken {
    return true;
  }
}
