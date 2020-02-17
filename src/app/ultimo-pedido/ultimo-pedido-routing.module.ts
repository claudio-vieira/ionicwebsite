import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UltimoPedidoPage } from './ultimo-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: UltimoPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UltimoPedidoPageRoutingModule {}
