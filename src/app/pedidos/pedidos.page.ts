import { UltimoPedidoPage } from './../ultimo-pedido/ultimo-pedido.page';
import { ItensPedidoPage } from './../itens-pedido/itens-pedido.page';
import { Subject } from 'rxjs';
import { ResumoPedidoPage } from './../resumo-pedido/resumo-pedido.page';
import { Funcoes } from './../Funcoes';
import { PedidosApiService } from './../services/pedidos-api.service';
import { SupervisoresApiService } from './../services/supervisores-api-service';
import { NavController, LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedidos',
  templateUrl: 'pedidos.page.html',
  styleUrls: ['pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  pedidos: any = [{}];
  pedidosFiltrados: any = [{}];
  filtro = '';
  panelOpenState = false;
  pedidoItens: any = [{}];
  subject: Subject<boolean>;

  saldoGorduraInicio: any;
  saldoGorduraUsado: any;

  constructor(public navCtrl: NavController,
              private api: PedidosApiService,
              private apiSupervisores: SupervisoresApiService,
              public modalController: ModalController,
              private alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {
    this.saldoGorduraInicio = 0;
    this.saldoGorduraUsado = 0;

    this.getPedidos();
    this.getSupervisor();
  }

  async buscarDetalhesPedido(pedido: any) {

    if (pedido.itensDoPedido) {
      this.expandirPedido(pedido);
    } else {
      await this.consultarItensDoPedido(pedido);
      this.expandirPedido(pedido);
    }

  }

  async consultarItensDoPedido(pedido: any) {
    if (!pedido.itensDoPedido) {
      await this.getItensPedido(pedido);
    }
  }

  expandirPedido(pedido: any) {
    const expandir = (pedido.expanded === 'false');

    if (expandir) {
      pedido.expanded = 'true';
    } else {
      pedido.expanded = 'false';
    }
  }

  filtrar(pedido: any) {
    const filtro = this.filtro.toLowerCase();
    let nomeCliente = '';
    if (pedido.clienteFantasia) {
      nomeCliente = pedido.clienteFantasia.toLowerCase();
    }
    const vendedorNome = pedido.vendedorNome.toLowerCase();
    const temCodigo = pedido.vendedorCodigo === this.filtro;
    const temNomeCliente = (nomeCliente.indexOf(filtro) > -1);
    const temNomeVendedor = (vendedorNome.indexOf(filtro) > -1);

    return temCodigo || temNomeCliente || temNomeVendedor;

  }

  filtrarPedidos() {
    this.pedidosFiltrados = this.pedidos
      .filter((pedido: any) => (this.filtrar(pedido)));
  }

  async getPedidos() {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    const cdSupervisor = window.localStorage.getItem('cdSupervisor');
    this.api.getPedidos(cdSupervisor)
      .subscribe(res => {
        this.pedidos = res.data_pedidos;
        this.pedidosFiltrados = this.pedidos;
        loading.dismiss();

        //console.log(this.pedidos);
        if (this.pedidos.length !== 0) {
        } else {
          Funcoes.mensagem(this.toastController, 'Sem pedidos');
        }
      }, err => {
        console.log(err);
        alert(err);
        loading.dismiss();
      });
  }

  async getSupervisor() {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    const cdSupervisor = window.localStorage.getItem('cdSupervisor');
    this.apiSupervisores.recuperarSupervisorPorCodigoGorduraAnoMes(cdSupervisor)
      .subscribe(res => {
        var sup = res.data_supervisores;
        this.saldoGorduraInicio = sup.saldogordurainicio;
        this.saldoGorduraUsado = sup.saldogordurausado;
        loading.dismiss();

        //console.log("res", res);
        if (sup !== undefined && sup.codigo != "") {
        } else {
          Funcoes.mensagem(this.toastController, 'Sem Supervisores');
        }
      }, err => {
        //console.log("err", err);
        alert(err);
        loading.dismiss();
      });
  }

  async confirmarLiberarPedido(pedido: any) {
    const alert = await this.alertController.create({
      message: 'Deseja liberar o pedido "' + pedido.cdpedido + '" ?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Sim',
          handler: () => {
            this.liberarPedido(pedido);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarRejeitarPedido(pedido: any) {
    const alert = await this.alertController.create({
      message: 'Deseja rejeitar o pedido "' + pedido.cdpedido + '" ?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Sim',
          handler: () => {
            this.rejeitarPedido(pedido);
          }
        }
      ]
    });

    await alert.present();
  }

  removerPedidoDaLista(pedido: any) {
    this.pedidos = this.pedidos.filter(obj => obj !== pedido);
    this.pedidosFiltrados = this.pedidosFiltrados.filter(obj => obj !== pedido);
  }

  calcularDadosDosItens(pedido) {
    let pesoLiquido = 0;
    let pesoBruto = 0;
    let qtde = 0;
    let volume = 0;
    for (const item of pedido.itensDoPedido) {
      pesoLiquido = pesoLiquido + ( item.produtoPesoliquido * item.qtdeproduto );
      pesoBruto = pesoBruto + ( item.produtoPesobruto * item.qtdeproduto );
      qtde = qtde + 1;
      volume = volume + item.qtdeproduto;
    }
    pedido.pesoliquido = pesoLiquido.toFixed(2);
    pedido.pesobruto = pesoBruto.toFixed(2);
    pedido.qtdeproduto = qtde;
    pedido.volumes = volume;
  }

  async abrirResumo(pedido: any) {

    if (pedido.itensDoPedido) {
      this.abrirResumoModal(pedido);
    } else {

      this.subject = new Subject();
      await this.consultarItensDoPedido(pedido);

      this.subject.subscribe(res => {
        console.log('enrtrei no subscribe do resumo');
        this.abrirResumoModal(pedido);
        this.subject.complete();
      });
    }
  }

  async abrirResumoModal(pedido) {
    const modal = await this.modalController.create({
      component: ResumoPedidoPage,
      componentProps: {
        pedido
      }
    });
    await modal.present();
  }

  async abrirItensPedido(pedido: any) {

    if (pedido.itensDoPedido) {
      this.abrirItensPedidoModal(pedido);
    } else {

      this.subject = new Subject();
      await this.consultarItensDoPedido(pedido);

      this.subject.subscribe(res => {
        console.log('enrtrei no subscribe do resumo');
        this.abrirItensPedidoModal(pedido);
        this.subject.complete();
      });
    }
  }

  async abrirItensPedidoModal(pedido) {
    const modal = await this.modalController.create({
      component: ItensPedidoPage,
      componentProps: {
        pedido
      }
    });
    await modal.present();
  }

  async abrirUltimoPedido(pedido: any) {

    if (pedido.ultimoPedido) {

      this.abrirUltimoPedidoModal(pedido);
    } else {

      this.subject = new Subject();

      this.subject.subscribe(res => {
        this.abrirUltimoPedidoModal(pedido);
        this.subject.complete();
      });

      await this.consultarUltimoPedido(pedido);
    }
  }

  async abrirUltimoPedidoModal(pedido) {
    const modal = await this.modalController.create({
      component: UltimoPedidoPage,
      componentProps: {
        pedido,
        pedidoAnterior: pedido.ultimoPedido
      }
    });
    await modal.present();
  }

  async getItensPedido(pedido: any) {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    this.api.getItensPedido(pedido.cdpedido, pedido.cdvendedor, pedido.cdcliente).subscribe(res => {
      console.log('enrtrei no subscribe do get');
      //console.log(res);
      if (this.subject) {
        this.subject.next(true);
      }
      pedido.itensDoPedido = res.data_itens;
      loading.dismiss();
      this.calcularDadosDosItens(pedido);

    }, err => {
      console.log(err);
      alert(err);
      loading.dismiss();
    });
  }

  async consultarUltimoPedido(pedido: any) {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    const cdSupervisor = window.localStorage.getItem('cdSupervisor');

    this.api.getUltimoPedido(pedido.vendedorCodigo, cdSupervisor, pedido.cdcliente, pedido.cdpedido).subscribe(res => {

      if (!res) {
        loading.dismiss();
        alert('Não há pedido anterior para este cliente');
        return;
      }

      pedido.ultimoPedido = res.data_pedidos;

      if (this.subject) {
      this.subject.next(true);
    }
      loading.dismiss();

  }, err => {
  console.log(err);
  alert(err);
  loading.dismiss();
});
  }

async rejeitarPedido(pedido: any) {

  const loading = await this.loadingController.create({
    message: 'Aguarde...',
    duration: 10000
  });
  await loading.present();

  this.api.rejeitarPedido(pedido.vendedorCodigo, pedido.cdpedido, pedido.cdcliente).subscribe(res => {

    if (res.status === 'success') {
      this.removerPedidoDaLista(pedido);
    }

    if (res.message != null) {
      Funcoes.mensagem(this.toastController, res.message);

    }
    loading.dismiss();

  }, err => {
    console.log(err);
    alert(err);
    loading.dismiss();
  });
}

async liberarPedido(pedido: any) {

  const loading = await this.loadingController.create({
    message: 'Aguarde...',
    duration: 10000
  });
  await loading.present();

  if(pedido.descricaoHistoricoGordura != 'BONIFICACAO' &&
    pedido.valalorPendenteGordura > (this.saldoGorduraInicio - this.saldoGorduraUsado)){
    Funcoes.mensagem(this.toastController, 'Não há saldo suficiente de gordura!');
    loading.dismiss();
  }else{
    
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var year = dateObj.getUTCFullYear();
    var anomes = year+""+(month <= 9 ? "0"+month : month);

    this.api.liberarPedido(pedido.vendedorCodigo, pedido.cdpedido, pedido.cdcliente, pedido.valalorPendenteGordura, anomes).subscribe(res => {

      if (res.message != null) {
        Funcoes.mensagem(this.toastController, res.message);
      }
      if (res.status === 'success') {
        this.removerPedidoDaLista(pedido);
        this.api.processarPedidos();
        this.getSupervisor();
      }

      loading.dismiss();

    }, err => {
      console.log(err);
      alert(err);
      loading.dismiss();
    });
  }
}
}
