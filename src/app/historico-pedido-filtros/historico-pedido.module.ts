import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoPedidoPageRoutingModule } from './historico-pedido-routing.module';

import { HistoricoPedidoPage } from './historico-pedido.page';

import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    HistoricoPedidoPageRoutingModule
  ],
  declarations: [HistoricoPedidoPage]
})
export class HistoricoPedidoPageModule {}
