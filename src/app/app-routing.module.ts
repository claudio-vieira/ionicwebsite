import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'pedidos', loadChildren: './pedidos/pedidos.module#PedidosPageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'resumo-pedido',
    loadChildren: './resumo-pedido/resumo-pedido.module#ResumoPedidoPageModule'
  },
  {
    path: 'itens-pedido',
    loadChildren: './itens-pedido/itens-pedido.module#ItensPedidoPageModule'
  },
  {
    path: 'ultimo-pedido',
    loadChildren: './ultimo-pedido/ultimo-pedido.module#UltimoPedidoPageModule'
  },
  {
    path: 'historico-pedido',
    loadChildren: './historico-pedido/historico-pedido.module#HistoricoPedidoPageModule'
  },
  {
    path: 'historico-pedido-filtros',
    loadChildren: './historico-pedido-filtros/historico-pedido.module#HistoricoPedidoPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
