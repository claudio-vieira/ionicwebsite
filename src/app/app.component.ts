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
      this.router.navigateByUrl('login');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  sair() {

    this.navCtrl.navigateRoot('login');
  }
}
