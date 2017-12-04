import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { EnvironmentsModule } from './environment-variables/environment-variables.module';


import { MyApp } from './app.component';
import { AgendaPage } from '../pages/agenda/agenda';
import { LoginPage } from '../pages/login/login';
import { AtualizarPage } from '../pages/atualizar/atualizar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EnvVariables } from './../app/environment-variables/environment-variables.token';
import { UserData } from '../providers/user-data';




@NgModule({
  declarations: [
    MyApp,
    AgendaPage,
    LoginPage,
    AtualizarPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    EnvironmentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AgendaPage,
    LoginPage,
    AtualizarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserData
  ]
})
export class AppModule { }
