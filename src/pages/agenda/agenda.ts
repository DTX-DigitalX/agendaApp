import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { Http, RequestOptions, Headers, Response } from '@angular/http';

//import { UserData } from '../../providers/user-data';

/**
 * Generated class for the AgendaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: 'agenda'
})
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})

export class AgendaPage {

  //@ViewChild(Content) content: Content;

  showAgenda: boolean;
  showSettings: boolean;
  showVideo: boolean;
  btnIcoMenu: boolean;
  btnIcoArrowBack: boolean;
  btnIcoRefresh: boolean;
  btnIcoSettings: boolean;

  timeline: any[];

  inputYouTubeHash: string;

  youtubeHash: string;
  youTubeUrl: any;

  palestra: any;
  palestraId: string; F

  eventUpdate: any;

  constructor(private http: Http, public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer, public alertController: AlertController) {
    let self = this;

    this.show("agenda");
    // this.timeline = this.getTimeline();
    this.getDataFromDtx();

    this.eventUpdate = setInterval(async () => {
      if (self.showAgenda == true) {
        self.timeline = await this.getEvent();
      }
    }, 30000);
  }


  ionViewDidLeave() {
    clearInterval(this.eventUpdate);
  }

  async getDataFromDtx() {
    try {
      this.timeline = await this.getEvent();
    } catch (error) {
      console.log(error);
    }
  }

  videoAoVivo(palestra: any) {
    // Chamar API
    if (palestra.isLive) {
      this.youtubeHash = palestra.youTubeHash;
      this.palestraId = palestra._id;
      this.getYouTubeUrl();

      this.show("video");
    }
  }

  async atualizar() {
    // Chamar API
    this.timeline = await this.getEvent();
    this.timeline.forEach(element => {
      if (element._id == this.palestraId) {
        this.youtubeHash = element.youTubeHash;
      }
    });

    this.getYouTubeUrl();
  }



  configurar() {
    this.show("settings");
  }

  voltar() {
    this.show("agenda");
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

  // scrollTo(element: string) {
  //   let yOffset = document.getElementById(element).offsetTop;
  //   this.content.scrollTo(0, yOffset, 4000)
  // }

  // permissionSettings() {
  //   let self = this;

  //   this.userData.getMatricula().then(function (value) {
  //     // Daniel - Ramde - Gabriela
  //     if (value == "10073689" || value == "10071480" || value == "10052761") {
  //       self.btnIcoSettings = true;
  //     }
  //   });
  // }

  getYouTubeUrl() {
    this.youTubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.youtubeHash + "?rel=0&amp;showinfo=0");
    // SKYPE
    //this.youTubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://join-noam.broadcast.skype.com/duratex.com.br/32c605af96884b44b1152c2760e28f10/pt-BR/");
  }

  async getEvent() {
    let environment = { URL_BASE: 'http://localhost:3000', CLIENT_ID: 'app', CLIENT_SECRET: 'app@imagine', URL_TOKEN: 'https://dtx-api.herokuapp.com/oauth/token' };

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

    let url = `${environment.URL_BASE}/event?date=${dateFormart}`;

    console.log("url: " + url);

    return this.http.get(url, options)
      .map((response: Response) => {
        console.log(response.json());

        return <any[]>response.json();
      })
      .catch((error: any) => Observable.throw(error.json() || 'Server error'))
      .toPromise();
  }

} var usuario = window.sessionStorage.getItem('usuario');
var senha = window.sessionStorage.getItem('senha');

