import { UltimoPedidoPage } from './../ultimo-pedido/ultimo-pedido.page';
import { ItensPedidoPage } from './../itens-pedido/itens-pedido.page';
import { Subject } from 'rxjs';
import { ResumoPedidoPage } from './../resumo-pedido/resumo-pedido.page';
import { Funcoes } from './../Funcoes';
import { PedidosApiService } from './../services/pedidos-api.service';
import { ClientesApiService } from './../services/clientes-api.service';
import { LocalidadesApiService } from './../services/localidades-api.service';
import { RepresentanteApiService } from './../services/representante-api.service';
import { NavController, LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historico-pedido',
  templateUrl: './historico-pedido.page.html',
  styleUrls: ['./historico-pedido.page.scss'],
})
export class HistoricoPedidoPage implements OnInit {

  pedidos: any = [{}];
  pedidosFiltrados: any = [{}];
  filtro = '';
  panelOpenState = false;
  pedidoItens: any = [{}];
  subject: Subject<boolean>;
  isEstadoAvailable = false; // Declare the variable (in this case isItemAvailable) and initialize the items with false
  estados: any[];
  cidades: any[];
  representantes: any[];

  representanteSelected: string;
  clienteSelected: string;
  estadoSelected: string;
  estadoSelectedUF: string;
  cidadeSelected: string;
  cidadeSelectedNome: string;
  situacaoSelected: string;
  dataInicioSelected: string;
  dataFimSelected: string;
  isSintetico: boolean;

  situacoes: any[];

  pesosBrutoB = 0; //Biscoito
  pesosBrutoM = 0; //Macarrao
  pesosBrutoF = 0; //Farinha
  pesosBrutoR = 0; //Revenda
  pesosLiquidoB = 0;
  pesosLiquidoM = 0;
  pesosLiquidoF = 0;
  pesosLiquidoR = 0;
  volumesB = 0;
  volumesM = 0;
  volumesF = 0;
  volumesR = 0;
  quantidadesB = 0;
  quantidadesM = 0;
  quantidadesF = 0;
  quantidadesR = 0;
  valoresB = 0;
  valoresM = 0;
  valoresF = 0;
  valoresR = 0;

  constructor(public navCtrl: NavController,
              private api: PedidosApiService,
              private apiLocalidades: LocalidadesApiService,
              private apiRepresentante: RepresentanteApiService,
              private apiClientes: ClientesApiService,
              public modalController: ModalController,
              private alertController: AlertController,
              public loadingController: LoadingController,
              public toastController: ToastController) { }

  ngOnInit() {
    this.getEstados("");
    this.getRepresentantes();

    this.situacoes = [];
    this.situacoes.push({nome:'Situação', id: "1"});
    this.situacoes.push({nome:'FATURADOS', id: "2"});
    this.situacoes.push({nome:'ASEREMENVIADOS', id: "0"});
    this.situacoes.push({nome:'CANCELADO', id: "9"});
    /*this.situacoes.push('TODOS');
    this.situacoes.push('FATURADOS');
    this.situacoes.push('ASEREMENVIADOS');
    this.situacoes.push('CANCELADO');*/

    var dataFim = new Date().toJSON().slice(0,10).replace(/-/g,'/').split("/",3)[0] +"-"+
               new Date().toJSON().slice(0,10).replace(/-/g,'/').split("/",3)[1] +"-"+
               new Date().toJSON().slice(0,10).replace(/-/g,'/').split("/",3)[2];
    this.dataFimSelected = dataFim+"T00:00:00.000";

    var dataInicio = new Date().toJSON().slice(0,10).replace(/-/g,'/').split("/",3)[0] +"-"+
               new Date().toJSON().slice(0,10).replace(/-/g,'/').split("/",3)[1] +"-01";
    this.dataInicioSelected = dataInicio+"T00:00:00.000";
  }

  async getEstados(uf: string){
    
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();
    this.estados = [];
    this.estados.push({sigla:'Estados', id: "0"});
    this.apiLocalidades.getEstados()
      .subscribe(res => {
        for (const item of res) {
          if(uf != ""){
            if(uf === item.sigla) this.estados.push({id:item.id, sigla: item.sigla});
          }else{
            this.estados.push({id:item.id, sigla: item.sigla});
          }
        }

        loading.dismiss();

        if (this.estados.length !== 0) {
        } else {
          Funcoes.mensagem(this.toastController, 'Sem estados');
        }
      }, err => {
        console.log(err);
        alert(err);
        loading.dismiss();
      });
  }
  
  async getCidades(estadoSelected: any){
    
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();
    this.cidades = [];
    this.cidades.push({nome:'Cidades', id: "0"});

    //Recupera todas as cidades por estado quando nao tem representante
    if(estadoSelected > 0 && (this.representanteSelected == undefined || this.representanteSelected == "0")){
      this.apiLocalidades.getCidadesPorIdentificador(estadoSelected)
        .subscribe(res => {

          for (const item of res) {
            if(this.cidades.map(function(e) { return e.id; }).indexOf(item.id) == -1){
              this.cidades.push({id:item.id, nome:item.nome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")});
            }
          }
          loading.dismiss();

          if (this.cidades.length !== 0) {
          } else {
            Funcoes.mensagem(this.toastController, 'Sem cidades');
          }
        }, err => {
          console.log(err);
          alert(err);
          loading.dismiss();
        });
    }
    //Recupera cidades relacionadas com o representante
    else{
      this.apiClientes.getCidadesPorPedidosPorCliente(this.representanteSelected, this.estadoSelectedUF)
        .subscribe(res => {
          //console.log("res", res);
          if(res != null && res.data_cidades != null && res.data_cidades[0] != null){
            for (const item of res.data_cidades) {
              //console.log("item", item);
              this.cidades.push({id:"0", nome:item.cidade});
            }
          }

          loading.dismiss();

          if (this.cidades != undefined && this.cidades.length !== 0) {
          } else {
            Funcoes.mensagem(this.toastController, 'Sem cidades');
          }
        }, err => {
          console.log(err);
          alert(err);
          loading.dismiss();
        });
    }
  }

  async getRepresentantes(){
    
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    
    const cdSupervisor = window.localStorage.getItem('cdSupervisor');
    
    await loading.present();
    
    this.representantes = [];
    this.representantes.push({nome:'Representante', codigo: "0"});
    this.apiRepresentante.recuperarVendedorPorCdSupervisor(cdSupervisor)
      .subscribe(res => {
        
        if(res != null && res.data_sellers != null && res.data_sellers[0] != null){
          for (const item of res.data_sellers) {
            this.representantes.push(item);
          }
        }

        loading.dismiss();

        if (this.representantes != undefined && this.representantes.length !== 0) {
        } else {
          Funcoes.mensagem(this.toastController, 'Sem representantes');
        }
      }, err => {
        console.log(err);
        alert(err);
        loading.dismiss();
      });
  }

  setarEstado(estadoSelected: any){
    for (var estadoId of this.estados) {
      if(estadoId.id == estadoSelected){
        this.estadoSelectedUF = estadoId.sigla;
      }
    }
    console.log("estadoSelected.sigla", estadoSelected.sigla);
    if(estadoSelected.sigla != "Estados") this.getCidades(estadoSelected);
  }
  
  setarCidade(cidadeSelected: any){
    for (var cidadeId of this.cidades) {
      if(cidadeId.nome == cidadeSelected){
        this.cidadeSelectedNome = cidadeId.nome;
      }
    }
  }

  setarDataInicio(dataInicioSelected: any){
    this.dataInicioSelected = dataInicioSelected;
  }
  
  setarDataFim(dataFimSelected: any){
    this.dataFimSelected = dataFimSelected;
  }

  setarRepresentante(representanteSelected: any){
    this.representanteSelected = representanteSelected;
    this.buscarEstadoRepresentante(representanteSelected);

    /*if(this.representanteSelected != undefined && this.representanteSelected != "" &&
        this.estadoSelectedUF != undefined && this.estadoSelectedUF != ""){*/
          //this.getCidades(0);
      //}
  }

  async buscarEstadoRepresentante(representanteSelected: any){
    
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();
    
    this.apiRepresentante.recuperarVendedorPorNomeCodigo(representanteSelected).subscribe(res => {
      console.log('enrtrei no subscribe do post');
      if(res != null && res.data_sellers != null && res.data_sellers[0] != null){
        this.getEstados(res.data_sellers[0].uf);
      }else{
        this.getEstados("");
      }

      loading.dismiss();
    }, err => {
      console.log(err);
      alert(err);
      loading.dismiss();
    });
  }

  setarCliente(clienteSelected: any){
    this.clienteSelected = clienteSelected;
  }

  switchSintetico(isSintetico: boolean){
    this.isSintetico = isSintetico;

    if(!isSintetico && this.pedidosFiltrados.length > 0 && 
      this.quantidadesB == 0 &&
      this.quantidadesM == 0 &&
      this.quantidadesF == 0 &&
      this.quantidadesR == 0 
      ) {
      var ids = "";
      for(const pedido of this.pedidosFiltrados){
        ids += pedido.cdpedido+",";
      }
      ids = ids.substring(0, ids.length-1);

      this.getItensPedidoSemCalculo(ids);
    }
  }

  getIsSintetico(){
    return this.isSintetico;
  }

  montarValoresSintetico(itens: any = [{}]){

    for(const item of itens){
      //console.log("item",item);
      if(item.especie == 1){//Macarrao
        this.valoresM = this.valoresM + item.valortotal//(item.precovenda * item.qtdeproduto);
        this.pesosBrutoM = this.pesosBrutoM + item.pesototal//item.pesobruto;
        this.pesosLiquidoM = this.pesosLiquidoM + item.pesoliqtotal//item.pesoliquido;
        this.volumesM = this.volumesM + item.volumetotal//item.qtdeproduto;
        this.quantidadesM++;
      }else if(item.especie == 2){//Biscoito
        this.valoresB = this.valoresB + item.valortotal//(item.precovenda * item.qtdeproduto);
        this.pesosBrutoB = this.pesosBrutoB + item.pesototal//item.pesobruto;
        this.pesosLiquidoB = this.pesosLiquidoB + item.pesoliqtotal//item.pesoliquido;
        this.volumesB = this.volumesB + item.volumetotal//item.qtdeproduto;
        this.quantidadesB++;
      }else if(item.especie == 4){//Farinhas
        this.valoresF = this.valoresF + item.valortotal//(item.precovenda * item.qtdeproduto);
        this.pesosBrutoF = this.pesosBrutoF + item.pesototal//item.pesobruto;
        this.pesosLiquidoF = this.pesosLiquidoF + item.pesoliqtotal//item.pesoliquido;
        this.volumesF = this.volumesF + item.volumetotal//item.qtdeproduto;
        this.quantidadesF++;
      }else if(item.especie == 6){//Revenda
        this.valoresR = this.valoresR + item.valortotal//(item.precovenda * item.qtdeproduto);
        this.pesosBrutoR = this.pesosBrutoR + item.pesototal//item.pesobruto;
        this.pesosLiquidoR = this.pesosLiquidoR + item.pesoliqtotal//item.pesoliquido;
        this.volumesR = this.volumesR + item.volumetotal//item.qtdeproduto;
        this.quantidadesR++;
      }
    }

    this.pesosBrutoB.toFixed(2);
    this.pesosBrutoM.toFixed(2);
    this.pesosBrutoF.toFixed(2);
    this.pesosBrutoR.toFixed(2);
    this.pesosLiquidoB.toFixed(2);
    this.pesosLiquidoM.toFixed(2);
    this.pesosLiquidoF.toFixed(2);
    this.pesosLiquidoR.toFixed(2);
    
    console.log("pesosBrutoM",this.pesosBrutoM);
  }

  setarSituacao(situacaoSelected: any){
    if(situacaoSelected === 'CANCELADO'){
      this.situacaoSelected = '9';
    }else if(situacaoSelected === 'FATURADOS'){
      this.situacaoSelected = '2';
    }else if(situacaoSelected === 'ASEREMENVIADOS'){
      this.situacaoSelected = '0';
    }
  }

  async buscarDetalhesPedido(pedido: any) {

    if (pedido.itensDoPedido) {
      this.expandirPedido(pedido);
    } else {
      await this.consultarItensDoPedido(pedido);
      this.expandirPedido(pedido);
    }

  }

  async consultarItensDoPedido(pedido: any) {
    if (!pedido.itensDoPedido) {
      await this.getItensPedido(pedido);
    }
  }

  expandirPedido(pedido: any) {
    const expandir = (pedido.expanded === 'false');

    if (expandir) {
      pedido.expanded = 'true';
    } else {
      pedido.expanded = 'false';
    }
  }

  filtrar(pedido: any) {
    const filtro = this.filtro.toLowerCase();
    let nomeCliente = '';
    if (pedido.clienteFantasia) {
      nomeCliente = pedido.clienteFantasia.toLowerCase();
    }
    const vendedorNome = pedido.vendedorNome.toLowerCase();
    const temCodigo = pedido.vendedorCodigo === this.filtro;
    const temNomeCliente = (nomeCliente.indexOf(filtro) > -1);
    const temNomeVendedor = (vendedorNome.indexOf(filtro) > -1);

    return temCodigo || temNomeCliente || temNomeVendedor;

  }

  filtrarPedidos() {
    this.pedidosFiltrados = this.pedidos
      .filter((pedido: any) => (this.filtrar(pedido)));
  }

  async getPedidos() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();
    //console.log("representanteSelected", this.representanteSelected);
    
    const cdSupervisor = window.localStorage.getItem('cdSupervisor');
    
    console.log("representanteSelected", this.representanteSelected);
    console.log("clienteSelected", this.clienteSelected);
    console.log("estadoSelectedUF", this.estadoSelectedUF);
    console.log("cidadeSelectedNome", this.cidadeSelectedNome);
    console.log("situacaoSelected", this.situacaoSelected);
    
    this.api.getPedidosPorFiltros(
          (this.representanteSelected === undefined || this.representanteSelected == "0" ? "" : this.representanteSelected), 
          (this.clienteSelected === undefined ? "" : this.clienteSelected), 
          (this.dataInicioSelected === undefined ? "" : this.dataInicioSelected.substring(8,10)+"/"+this.dataInicioSelected.substring(5,7)+"/"+this.dataInicioSelected.substring(0,4)), 
          (this.dataFimSelected === undefined ? "" : this.dataFimSelected.substring(8,10)+"/"+this.dataFimSelected.substring(5,7)+"/"+this.dataFimSelected.substring(0,4)), 
          (this.estadoSelectedUF === undefined || this.estadoSelectedUF == "Estados" ? "" : this.estadoSelectedUF), 
          (this.cidadeSelectedNome === undefined || this.cidadeSelectedNome == "Cidades" ? "" : Funcoes.replaceAccents(this.cidadeSelectedNome)), 
          (this.situacaoSelected === undefined || this.situacaoSelected == "1" ? "" : this.situacaoSelected), 
          cdSupervisor)
      .subscribe(res => {
        this.pedidos = res.data_pedidos;
        this.pedidosFiltrados = this.pedidos;

        this.resetarValoresSintetico();
        
        //Recalcula os valores sintéticos
        if(this.isSintetico){
          var ids = "";
          for(const pedido of this.pedidosFiltrados){
            ids += pedido.cdpedido+",";
          }
          ids = ids.substring(0, ids.length-1);

          this.getItensPedidoSemCalculo(ids);
        } 

        loading.dismiss();

        if (this.pedidos.length !== 0) {
        } else {
          Funcoes.mensagem(this.toastController, 'Sem pedidos');
        }
      }, err => {
        console.log(err);
        alert(err);
        loading.dismiss();
      });
  }

  removerPedidoDaLista(pedido: any) {
    this.pedidos = this.pedidos.filter(obj => obj !== pedido);
    this.pedidosFiltrados = this.pedidosFiltrados.filter(obj => obj !== pedido);
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

  async abrirResumo(pedido: any) {

    if (pedido.itensDoPedido) {
      this.abrirResumoModal(pedido);
    } else {

      this.subject = new Subject();
      await this.consultarItensDoPedido(pedido);

      this.subject.subscribe(res => {
        console.log('enrtrei no subscribe do resumo');
        this.abrirResumoModal(pedido);
        this.subject.complete();
      });
    }
  }

  async abrirResumoModal(pedido) {
    const modal = await this.modalController.create({
      component: ResumoPedidoPage,
      componentProps: {
        pedido
      }
    });
    await modal.present();
  }

  async abrirItensPedido(pedido: any) {
    console.log("pedido.itensDoPedido", pedido.itensDoPedido);
    if (pedido.itensDoPedido) {
      this.abrirItensPedidoModal(pedido);
    } else {

      this.subject = new Subject();
      await this.consultarItensDoPedido(pedido);

      this.subject.subscribe(res => {
        console.log('enrtrei no subscribe do resumo');
        this.abrirItensPedidoModal(pedido);
        this.subject.complete();
      });
    }
  }

  async abrirItensPedidoModal(pedido) {
    console.log("pedido", pedido);
    const modal = await this.modalController.create({
      component: ItensPedidoPage,
      componentProps: {
        pedido
      }
    });
    await modal.present();
  }

  async abrirUltimoPedido(pedido: any) {

    if (pedido.ultimoPedido) {

      this.abrirUltimoPedidoModal(pedido);
    } else {

      this.subject = new Subject();

      this.subject.subscribe(res => {
        this.abrirUltimoPedidoModal(pedido);
        this.subject.complete();
      });

      await this.consultarUltimoPedido(pedido);
    }
  }

  async abrirUltimoPedidoModal(pedido) {
    const modal = await this.modalController.create({
      component: UltimoPedidoPage,
      componentProps: {
        pedido,
        pedidoAnterior: pedido.ultimoPedido
      }
    });
    await modal.present();
  }

  async getItensPedido(pedido: any) {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    this.api.getItensPedido(pedido.cdpedido).subscribe(res => {
      console.log('enrtrei no subscribe do get');
      console.log(res);
      if (this.subject) {
        this.subject.next(true);
      }
      pedido.itensDoPedido = res.data_itens;
      loading.dismiss();
      this.calcularDadosDosItens(pedido);

    }, err => {
      console.log(err);
      alert(err);
      loading.dismiss();
    });
  }

  async getItensPedidoSemCalculo(ids: string) {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();
    //console.log("ids", ids);

    this.api.getItensPorIdsPedidos(ids, this.representanteSelected).subscribe(res => {
      console.log('enrtrei no subscribe do get');
      console.log(res);
      if (this.subject) {
        this.subject.next(true);
      }
      this.montarValoresSintetico(res.data_itens);
      //this.calcularDadosDosItens(pedido);
      loading.dismiss();
    }, err => {
      console.log(err);
      alert(err);
      loading.dismiss();
    });

    
  }

  async consultarUltimoPedido(pedido: any) {

    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      duration: 10000
    });
    await loading.present();

    const cdSupervisor = window.localStorage.getItem('cdSupervisor');

    this.api.getUltimoPedido(pedido.vendedorCodigo, cdSupervisor, pedido.cdcliente).subscribe(res => {

      if (!res) {
        loading.dismiss();
        alert('Não há pedido anterior para este cliente');
        return;
      }

      pedido.ultimoPedido = res.data_pedidos;

      if (this.subject) {
      this.subject.next(true);
    }
      loading.dismiss();

  }, err => {
  console.log(err);
  alert(err);
  loading.dismiss();
});
  }

  resetarValoresSintetico(){
    this.pesosBrutoB = 0;
    this.pesosBrutoM = 0;
    this.pesosBrutoF = 0;
    this.pesosBrutoR = 0;
    this.pesosLiquidoB = 0;
    this.pesosLiquidoM = 0;
    this.pesosLiquidoF = 0;
    this.pesosLiquidoR = 0;
    this.volumesB = 0;
    this.volumesM = 0;
    this.volumesF = 0;
    this.volumesR = 0;
    this.quantidadesB = 0;
    this.quantidadesM = 0;
    this.quantidadesF = 0;
    this.quantidadesR = 0;
    this.valoresB = 0;
    this.valoresM = 0;
    this.valoresF = 0;
    this.valoresR = 0;
  }
}
