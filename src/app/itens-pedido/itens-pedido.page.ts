import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-itens-pedido',
  templateUrl: './itens-pedido.page.html',
  styleUrls: ['./itens-pedido.page.scss'],
})
export class ItensPedidoPage implements OnInit {

  @Input() pedido: any;
  @Input() pedidoAnterior: any;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
