import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumoPedidoPage } from './resumo-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: ResumoPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumoPedidoPageRoutingModule {}
