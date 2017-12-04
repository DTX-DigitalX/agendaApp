import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, } from '@angular/http';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EnvVariables } from './../app/environment-variables/environment-variables.token';

@Injectable()
export class UserData {

    _favorites: string[] = [];
    HAS_LOGGED_IN = 'hasLoggedIn';
    TOKEN_INFO = 'tokenInfo';
    //PERFIL_USUARIO = 'perfilUsuario';
    USER_USU = 'user';
    SENHA_USU = 'senha';
    DATA_HORA_TOKEN = 'token_expira';


    private tokenInfo: {};
    private tokenExpira: any;
    private logado: boolean;
    private visualizouTutorial: boolean;
    // private aceitouTermosDeUso: boolean;
    //private perfilUsuario: Object;

    constructor(
        public http: Http,
        public events: Events,
        public storage: Storage,
        @Inject(EnvVariables) public envVariables: any
    ) { }

    login(login: any): Promise<any> {
        let options = new RequestOptions();

        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return new Promise((resolve, reject) => {
            let variables = {
                grant_type: 'password',
                username: login.user,
                password: login.senha,
                client_id: 'app',
                client_secret: 'app@imagine',
            }
            let body = 'grant_type=password&username=' + variables.username + '&password=' + variables.password + '&client_id=' + variables.client_id + '&client_secret=' + variables.client_secret;
            this.http.post(this.envVariables.token, body, options)
                .map(response => response.json())
                .subscribe(result => {
                    console.log('token', result);
                    this.logado = true;

                    this.setTokenInfo({
                        token: result.access_token,
                        ExpireIn: result.expires_in
                    })
                        .then(re => {
                            console.log('result', result)
                            resolve(result);
                        });

                    this.events.publish('user:login');

                }, function (response: any) {
                    this.logado = false;
                    let description: string;

                    if (response.status && response.statusText && (response.status == 500 || response.status == 406)) {
                        if (response._body) {
                            description = response.status + ' - ' + response.statusText + ' - ' + response._body;
                        } else {
                            description = response.status + ' - ' + response.statusText;
                        }

                    } else {
                        description = response.json();
                    }
                    switch (response.status) {
                        case 401:
                            description = "DataPower não autorizado.";
                            break;
                        case 0:
                        case -1:
                        case 502:
                            description = "Sem comunicação com o servidor. Verifique sua conexao com a internet.";
                            break;
                        default:
                            description = response.json();
                            break;
                    }

                    reject(description);
                });
        });



    }

    logout() {
        this.logado = false;
        this.storage.remove(this.USER_USU);
        this.storage.remove(this.SENHA_USU);
        this.storage.remove(this.TOKEN_INFO);
        this.storage.remove(this.DATA_HORA_TOKEN);
        this.tokenExpira = undefined;
        return this.setTokenInfo(null)
            .then(() => this.storage.remove('username'))
            .then(() => this.events.publish('user:logout'))
            .then(() => {
            });
    };

    hasLoggedIn(): Promise<boolean> {
        console.log(this.logado);
        if (this.logado !== undefined)
            return Promise.resolve(this.logado);

        return this.getTokenInfo().then((value) => {
            console.log(value);
            this.logado = value != undefined;
            return this.logado;
        })
            .catch(() => {
                this.logado = false;
                return this.logado;
            });
    };

    getTokenInfo(): Promise<any> {
        if (this.tokenInfo !== undefined)
            return Promise.resolve(this.tokenInfo);

        return this.storage.get(this.TOKEN_INFO).then((value) => {
            this.tokenInfo = value;
            return value;
        });
    }

    setTokenInfo(token: any) {
        this.tokenInfo = token;

        if (!token) {
            this.tokenExpira = undefined;
            this.storage.remove(this.DATA_HORA_TOKEN);
            return this.storage.remove(this.TOKEN_INFO);
        } else {
            let _data = new Date();
            let _segundos = _data.getSeconds();
            _data.setSeconds(_segundos + token.ExpireIn / 2);
            this.tokenExpira = _data;
            this.storage.set(this.DATA_HORA_TOKEN, _data);
            return this.storage.set(this.TOKEN_INFO, token);
        }

    };
}