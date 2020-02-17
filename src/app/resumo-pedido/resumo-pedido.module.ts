import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumoPedidoPageRoutingModule } from './resumo-pedido-routing.module';

import { ResumoPedidoPage } from './resumo-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumoPedidoPageRoutingModule
  ],
  declarations: [ResumoPedidoPage]
})
export class ResumoPedidoPageModule {}
