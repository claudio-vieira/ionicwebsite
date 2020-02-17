import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UltimoPedidoPageRoutingModule } from './ultimo-pedido-routing.module';

import { UltimoPedidoPage } from './ultimo-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UltimoPedidoPageRoutingModule
  ],
  declarations: [UltimoPedidoPage]
})
export class UltimoPedidoPageModule {}
