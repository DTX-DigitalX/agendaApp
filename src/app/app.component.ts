import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { RequestOptionsArgs, RequestOptions } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EnvVariables } from './../app/environment-variables/environment-variables.token';
import { UserData } from '../providers/user-data';
import { Storage } from '@ionic/storage';

import { AgendaPage } from '../pages/agenda/agenda';
import { LoginPage } from '../pages/login/login';
import { AtualizarPage } from '../pages/atualizar/atualizar';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AgendaPage;

  isLogin: boolean;

  pages: Array<{ title: string, component: any }>;
  login: { title: string, component: any, hide: any };
  logout: { title: string, component: any, hide: any };
  atualizar: { title: string, component: any, hide: any };

  constructor(
    public platform: Platform,
    public storage: Storage,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userData: UserData,
    public events: Events) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Agenda', component: AgendaPage }
    ];

    this.atualizar = {
      title: 'Configuração', component: AtualizarPage,
      hide: true
    };

    this.login = {
      title: 'Login', component: LoginPage,
      hide: false
    };

    this.logout = {
      title: 'Logout', component: LoginPage,
      hide: true
    };

    this.listenToEvents();
  }

  listenToEvents() {
    this.events.subscribe('user:login', () => {
      this.userData.hasLoggedIn().then((login) => {
        console.log("user:login");
        console.log(login);
        this.atualizar.hide = !login;
        this.login.hide = login;
        this.logout.hide = !login;
      });
    })
  }


  userLogout(login) {
    this.userData.logout().then(() => {
      console.log(login);
      this.atualizar.hide = login;
      this.login.hide = !login;
      this.logout.hide = login;
      this.nav.setRoot(AgendaPage);
    });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
