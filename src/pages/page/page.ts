import { Events } from 'ionic-angular';

export class Page {
  constructor(
    public events: Events) {
  }

  ionViewDidLoad() {
  
    this.events.publish('page:ionViewDidLoad', this.constructor['name'])
  }

  ionViewDidEnter() {
    
    this.visualizarPagina();
  }

  protected visualizarPagina() {
     
    var paginaAtual = window.location.hash.replace('#', '');
    this.events.publish('user:visualizarPagina', paginaAtual);
  }
}
