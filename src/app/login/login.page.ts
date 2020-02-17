import { Funcoes } from './../Funcoes';
import { UsuarioApiService } from './../services/usuario-api.service';
import { NavController, ToastController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html'
})
export class LoginPage implements OnInit {
  supervisor: any = {};
  edtCodigo: string;
  edtSenha: string;
  token: any = {};

  constructor(public navCtrl: NavController,
              private api: UsuarioApiService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              private menu: MenuController) {}

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.menu.enable(false);
   }

   goToPedidos() {
    this.navCtrl.navigateForward('pedidos');
    this.menu.enable(true);
   }

  async getLogin() {

    if ((this.edtCodigo == null) || (this.edtSenha == null)) {
      Funcoes.mensagem(this.toastController, 'Os campos usuário e senha são obrigatórios');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    await this.api.getLogin(this.edtCodigo, this.edtSenha)
      .subscribe(res => {
        this.supervisor = res.data_supervisores;
        loading.dismiss();

        if (this.supervisor != null) {

          window.localStorage.setItem('cdSupervisor', this.supervisor.codigo);
          window.localStorage.setItem('nomeSupervisor', this.supervisor.descricao);

          this.goToPedidos();

        } else {
          Funcoes.mensagem(this.toastController, 'Supervisor não encontrado');
        }
      }, err => {
        console.log(err);
        alert('Login inválido');
        loading.dismiss();
      });
  }
}
