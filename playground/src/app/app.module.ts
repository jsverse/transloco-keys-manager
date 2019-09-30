import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TRANSLOCO_CONFIG, TranslocoConfig, TranslocoModule} from '@ngneat/transloco';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslocoModule
  ],
  providers: [
    {
    provide: TRANSLOCO_CONFIG,
    useValue: {
      prodMode: false,
      availableLangs: [{ id: 'en', label: 'English' }, { id: 'es', label: 'Spanish' }],
      reRenderOnLangChange: true,
      fallbackLang: 'es',
      defaultLang: 'en',
      scopeMapping: {
        'todos-page': 'todos',
        'transpilers/messageformat': 'mf'
      }
    } as TranslocoConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
