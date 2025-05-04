import { Directive, HostListener, inject, input, OnDestroy } from '@angular/core';
import { ActionHintTypeEnum } from 'src/app/core/ui';
import { ActionHintService } from '../../services/mw-action-hint.service';

// Maybe some animation can be provided.
@Directive({
  selector: '[mwActionHint]',
  standalone: false,
})
export class MwActionHintDirective implements OnDestroy {
  private readonly actionHint = inject(ActionHintService);

  public mwActionHint = input.required<string>();

  public ngOnDestroy(): void {
    this.actionHint.hintMessage$.next(null);
  }

  @HostListener('mouseenter')
  public showHint(): void {
    this.actionHint.hintMessage$.next({
      type: ActionHintTypeEnum.CustomHtml,
      html: this.mwActionHint(),
    });
  }

  @HostListener('mouseleave')
  public hideHint(): void {
    this.actionHint.hintMessage$.next(null);
  }
}
