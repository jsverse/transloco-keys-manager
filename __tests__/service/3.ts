import { Component, OnInit, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'inject-test',
  template: ``
})
export class InjectTestClass implements OnInit {
  transloco = inject(TranslocoService);

  ngOnInit() {
    this.transloco.translate('inject.test');
  }
}
