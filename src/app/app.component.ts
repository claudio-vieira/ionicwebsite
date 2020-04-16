import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      title: 'Pedidos',
      url: '/pedidos',
      icon: 'home'
    },
    {
      title: 'Histórico de pedidos',
      url: '/historico-pedido',
      icon: 'filing'
    }
  ];

  constructor(
    private platform: Platform,
    private router: Router,
    private navCtrl: NavController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const cdSupervisorLogado = window.localStorage.getItem('cdSupervisor');
      if (cdSupervisorLogado) {
        this.router.navigateByUrl('pedidos');
      } else {
        this.router.navigateByUrl('login');
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  sair() {
    window.localStorage.setItem('cdSupervisor', '');
    window.localStorage.setItem('nomeSupervisor', '');
    this.navCtrl.navigateRoot('login');
  }
}
