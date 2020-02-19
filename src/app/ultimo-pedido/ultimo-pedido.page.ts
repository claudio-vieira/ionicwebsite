import { ItensPedidoPage } from './../itens-pedido/itens-pedido.page';
import { PedidosApiService } from './../services/pedidos-api.service';
import { Subject, Observable } from 'rxjs';
import { ModalController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ultimo-pedido',
  templateUrl: './ultimo-pedido.page.html',
  styleUrls: ['./ultimo-pedido.page.scss'],
})
export class UltimoPedidoPage implements OnInit {

  @Input() pedido: any;
  @Input() pedidoAnterior: any;
  itens: Array<any> = [];
  pedidoAjustado: any;

  constructor(public navCtrl: NavController,
              private api: PedidosApiService,
              public modalController: ModalController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {

  }

  async getItensPedido(pedido: any): Promise<boolean> {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    return this.api.getItensPedido(pedido.cdpedido).toPromise().then(res => {
      pedido.itensDoPedido = res.data_itens;
      loading.dismiss();
      this.calcularDadosDosItens(pedido);
      return true;
    }, err => {
      console.log(err);
      alert(err);
      loading.dismiss();
      return false;
    });
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

  async consultarItensDoPedido(pedido: any): Promise<boolean> {
    if (!pedido.itensDoPedido) {
      return this.getItensPedido(pedido);
    }
    return true;
  }

  async abrirComparacaoItens() {

    if ((this.pedido.itensDoPedido) && (this.pedidoAnterior.itensDoPedido)) {
      this.ajustarDados();
      this.abrirItensPedidoModal(this.pedidoAjustado);
    } else {

      await this.consultarItensDoPedido(this.pedido);
      await this.consultarItensDoPedido(this.pedidoAnterior);

      this.ajustarDados();

      this.abrirItensPedidoModal(this.pedidoAjustado);

    }
  }

  ajustarDados() {
    for (const item of this.pedido.itensDoPedido) {
      item.tipoItem = 'A';
      item.class = 'corAtual';
    }

    for (const item of this.pedidoAnterior.itensDoPedido) {
      item.tipoItem = 'P';
      item.class = 'corAnterior';
    }

    this.popularArrayFinal();
  }

  popularArrayFinal() {
    this.pedidoAjustado = null;
    this.itens = [];
    this.pedidoAjustado = Object.assign({}, this.pedido);
    let itensAnterior = this.pedidoAnterior.itensDoPedido;

    for (const itemAtual of this.pedido.itensDoPedido) {
       // insere o item atual
      this.itens.push(itemAtual);

      // busca se existe itens no pedido anterior com o mesmo codigo
      let itensMesmoCodigo = this.pedidoAnterior.itensDoPedido.filter(obj => {
        return obj.cdproduto === itemAtual.cdproduto;
      });

      // caso achou percorre e insere o item no array
      if (itensMesmoCodigo.length > 0) {
        for (const itemAnteriorIgual of itensMesmoCodigo) {
          this.itens.push(itemAnteriorIgual);
          itensAnterior = itensAnterior.filter(obj => obj !== itemAnteriorIgual);
        }
        // depois que terminou a iteracao retorno o valor para null
        itensMesmoCodigo = null;
      }
    }

    // percorro o que sobrou de itens anteriores e adiciono no array
    for (const itemAnterior of itensAnterior) {
      this.itens.push(itemAnterior);
    }
    this.pedidoAjustado.itensDoPedido = this.itens;
  }

  async abrirItensPedidoModal(pedido: any) {
    const modal = await this.modalController.create({
      component: ItensPedidoPage,
      componentProps: {
        pedido
      }
    });
    await modal.present();
  }


  closeModal() {
    this.modalController.dismiss();
  }


}
