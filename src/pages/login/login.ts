import { Page } from '../page/page';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, MenuController, Events, LoadingController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { AtualizarPage } from '../atualizar/atualizar';


@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends Page {
  login: {
    user?: string,
    senha?: string
  } = {};
  senhaRaw: string;
  userRaw: string;
  submitted = false;
  mensagemErro: string = null;
  loading: any;
  btnEntrar: boolean;


  constructor(
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData,
    public menu: MenuController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController
  ) {
    super(events)
    this.btnEntrar = true;
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Carregando...'
    });

    this.loading.present();
  }

  dismiss() {
    if (this.loading != null) {
      setTimeout(() => {
        this.loading.dismiss();
      }, 500);

      this.loading = null;
    }
  }

  // username: 'app@dtx.com.br',
  // password: '123456',

  async onLogin(form: NgForm) {
    this.login.user = this.userRaw;
    this.login.senha = this.senhaRaw
    this.btnEntrar = false;
    this.submitted = true;
    if (form.valid) {
      this.presentLoadingDefault();

      this.userData.login(this.login).then((token) => {
        this.menu.enable(true);
        this.loading.dismiss();
        this.navCtrl.setRoot(AtualizarPage);
      })
        .catch(error => {
          this.loading.dismiss();
          console.error('onLogin', error)
          this.mensagemErro = error;
          this.btnEntrar = true;
        });
    }
  }

  btnVoltar() {
    this.navCtrl.pop();
  }

  isValid(form: NgForm){
    return form.invalid; 
  }

}