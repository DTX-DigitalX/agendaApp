import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { Http, RequestOptions, Headers, Response } from '@angular/http';

/**
 * Generated class for the AtualizarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-atualizar',
  templateUrl: 'atualizar.html',
})
export class AtualizarPage {

  showAgenda: boolean;
  showSettings: boolean;
  showVideo: boolean;
  btnIcoMenu: boolean;
  btnIcoArrowBack: boolean;
  btnIcoRefresh: boolean;
  btnIcoSettings: boolean;

  timeline: any[];
  
  token: any;
  isLoggedIn: boolean;

  inputYouTubeHash: string;

  youtubeHash: string;
  youTubeUrl: any;

  palestra: any;
  palestraId: string;

  environment = { URL_BASE: 'http://localhost:3000', CLIENT_ID: 'app', CLIENT_SECRET: 'app@imagine', URL_TOKEN: 'https://dtx-api.herokuapp.com/oauth/token' };

  constructor(private http: Http, public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer, public alertController: AlertController) {
    let self = this;

    this.getDataFromDtx();
    
  }

  async getDataFromDtx() {
    try {
      await this.loginDtxLab();
      if (this.isLoggedIn) {
        this.timeline = await this.getEvent();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loginDtxLab() {
    let email = "app@dtx.com.br";
    let password = "123456";

    this.isLoggedIn = false;
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: header });

    let body = 'grant_type=password&username=' + email + '&password=' + password + '&client_id=' + this.environment.CLIENT_ID + '&client_secret=' + this.environment.CLIENT_SECRET;
    let url = this.environment.URL_TOKEN;
    return this.http.post(url, body, options)
      .map((response: Response) => {
        localStorage.setItem('token', JSON.stringify(response.json()));
        this.isLoggedIn = true;
        this.token = response.json();
        console.log('token: '+ this.token);

        return this.token;
      })
      .catch((error: any) => Observable.throw(error.json() || 'Server error'))
      .toPromise();
  }

  async getEvent() {

    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: header });

    let dateNow = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    console.log(dateNow);

    var zeroString = "00";

    var month = `${dateNow.getMonth() + 1}`;
    var monthFormat = zeroString.substring(month.length, 2) + month;

    var day = `${dateNow.getDate()}`;
    var dayFormat = zeroString.substring(day.length, 2) + day;

    var hours = `${dateNow.getHours()}`;
    var hoursFormat = zeroString.substring(hours.length, 2) + hours;

    var minutes = `${dateNow.getMinutes()}`;
    var minutesFormat = zeroString.substring(minutes.length, 2) + minutes;

    let dateFormart = `${dateNow.getFullYear()}${monthFormat}${dayFormat}${hoursFormat}${minutesFormat}`;
    console.log(dateFormart);

    let url = `${this.environment.URL_BASE}/event?date=${dateFormart}`;

    console.log("url: " + url);

    return this.http.get(url, options)
      .map((response: Response) => {
        console.log(response.json());

        return <any[]>response.json();
      })
      .catch((error: any) => Observable.throw(error.json() || 'Server error'))
      .toPromise();
  }

  carregarHash(palestra: any) {
    this.inputYouTubeHash = palestra.youTubeHash;
  }

  gravar() {
    if (this.inputYouTubeHash && this.palestra) {
      this.putEvent(this.palestra._id, this.inputYouTubeHash)
        .then(() => {
          this.successfulAlert();
          this.palestra = null;
          this.inputYouTubeHash = null;
        })
        .catch(() => this.erroAlert());
    }
  }

  async putEvent(id: string, youTubeHash: string) {
    const headerToken = 'Bearer ' + this.token.access_token;

    console.log('headerToken');

    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    header.append('Authorization', headerToken);

    let body = `_id=${id}&youTubeHash=${youTubeHash}`;

    let options = new RequestOptions({ headers: header });

    let url = `${this.environment.URL_BASE}/api/event`;

    return this.http.put(url, body, options)
      .map((response: Response) => {
        console.log(response.json());

        return response.json();
      })
      .catch((error: any) => Observable.throw(error.json() || 'Server error'))
      .toPromise();
      
  }

  successfulAlert() {
    let alert = this.alertController.create({
      title: 'Aviso',
      subTitle: 'Dados gravados com sucesso!',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.show("agenda");
        }
      }]
    });
    alert.present();
  }

  show(tela: string) {
    switch (tela) {
      case "agenda":
        this.showAgenda = true;
        this.showVideo = false;
        this.showSettings = false;

        this.btnIcoMenu = true;
        this.btnIcoArrowBack = false;
        //this.permissionSettings(); //this.btnIcoSettings;
        this.btnIcoRefresh = false;

        break;
      case "settings":
        this.showAgenda = false;
        this.showVideo = false;
        this.showSettings = true;

        this.btnIcoMenu = false;
        this.btnIcoArrowBack = true;
        this.btnIcoSettings = false;
        this.btnIcoRefresh = false;

        break;
      case "video":
        this.showAgenda = false;
        this.showVideo = true;
        this.showSettings = false;

        this.btnIcoMenu = false;
        this.btnIcoArrowBack = true;
        this.btnIcoSettings = false;
        this.btnIcoRefresh = true;

        break;
    }

  }

  erroAlert() {
    let alert = this.alertController.create({
      title: 'Aviso',
      subTitle: 'Ocorreu um erro, tente novamente!',
      buttons: [{
        text: 'Ok'
      }]
    });
    alert.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AtualizarPage');
  }

}
