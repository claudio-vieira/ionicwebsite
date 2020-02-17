import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItensPedidoPageRoutingModule } from './itens-pedido-routing.module';

import { ItensPedidoPage } from './itens-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItensPedidoPageRoutingModule
  ],
  declarations: [ItensPedidoPage]
})
export class ItensPedidoPageModule {}
