import { UltimoPedidoPage } from './ultimo-pedido/ultimo-pedido.page';
import { UltimoPedidoPageModule } from './ultimo-pedido/ultimo-pedido.module';
import { ItensPedidoPage } from './itens-pedido/itens-pedido.page';
import { ItensPedidoPageModule } from './itens-pedido/itens-pedido.module';
import { ResumoPedidoPage } from './resumo-pedido/resumo-pedido.page';
import { ResumoPedidoPageModule } from './resumo-pedido/resumo-pedido.module';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


registerLocaleData(ptBr);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [ResumoPedidoPage, ItensPedidoPage, UltimoPedidoPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    ResumoPedidoPageModule,
    ItensPedidoPageModule,
    UltimoPedidoPageModule,
    IonicModule.forRoot({
      animated: true
      // mode: 'ios',
    }),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: LOCALE_ID, useValue: 'pt-PT'},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
