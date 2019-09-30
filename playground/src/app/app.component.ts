import { Component } from '@angular/core';
import { TranslocoService, translate } from '@ngneat/transloco';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private service: TranslocoService) {}

  ngOnInit() {
    this.service.selectTranslate('32');
    this.service.translate('33.34.35');
    this.service.selectTranslate('general.a.b');
    this.service.translate('general_b.a');
    this.service.translate('36', {}, 'es');
    this.service.selectTranslate('37', {});
  }

  change(lang: string) {
    this.service.selectTranslate('38').subscribe();
    this.service.translate('39');
    this.service.selectTranslate('40.41.42').subscribe();
    this.service.selectTranslate('3.4.5', {}, 'todos-page|scoped').subscribe();
    this.service.selectTranslate('6.7', {}, 'todos-page|scoped').subscribe();
    this.service.translate('3.4', {}, 'transpilers/messageformat|scoped');
    this.service.selectTranslate('5.6', {}, 'transpilers/messageformat/es').subscribe();
    this.service.translate(`43`);
    this.service.selectTranslate(`44`).subscribe();
    this.service.translate(`45.46.47`);
    this.service.selectTranslate(`8.9.10`, {}, 'todos-page|scoped').subscribe();
    this.service.selectTranslate('11.12.13', {}, `todos-page|scoped`).subscribe();
    this.service.translate('14.15', {}, `todos-page|scoped`);
    this.service.translate(`7.8`, {}, 'transpilers/messageformat|scoped');
    this.service.translate(`9.10`, {}, `transpilers/messageformat/es`);
    this.service.translate('48', { bla: 'jisk', another: `${noProblem}` });
    this.service.translate('11', {}, `transpilers/messageformat|scoped`);
    this.service.translate('12', { bla: 'jisk' + myvar, another: `${noProblem}` }, `transpilers/messageformat|scoped`);
    this.myConfig = {
      label: this.service.translate('49'),
      label2: this.service.translate('50', { params: { b: 's' } }),
      label3: this.service.translate('13', { params: { b: 's' } }, `transpilers/messageformat|scoped`),
      label4: translate('51', { params: { b: 's' } }),
      label5: translate('14', { params: { b: 's' } }, `transpilers/messageformat|scoped`)
    };

    this.service.selectTranslate(`${1}.dont1.grab1`).subscribe();
    this.service.translate(`dont2.${2}.grab2`);
    this.service.selectTranslate(`dont3.grab.${3}`).subscribe();
    this.service.translate(`dont4` + variable);
    const a = this.service.translate('dont5' + variable).subscribe();
    this.service.translate('don6' + variable);
    this.service.selectTranslate(variable + `dont7`).subscribe();
    const a = this.service.selectTranslate(variable + 'dont8').subscribe();
    this.service.translate(variable + 'dont9');
    this.service.translate('dont10', {}, `grab10` + variable);
    this.service.selectTranslate('dont11', {}, 'grab11' + variable).subscribe();
    this.service.translate('dont12', {}, 'grab12' + variable);
    this.service.selectTranslate('dont13', {}, variable + `grab13`).subscribe();
    this.service.selectTranslate('dont14', {}, variable + 'grab14').subscribe();
    this.service.translate('dont15', {}, variable + 'grab15');
  }
}
