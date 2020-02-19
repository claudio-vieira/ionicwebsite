import { ProdutoDTO } from './../DTO/produtoDTO';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-resumo-pedido',
  templateUrl: './resumo-pedido.page.html',
  styleUrls: ['./resumo-pedido.page.scss'],
})
export class ResumoPedidoPage implements OnInit {

  @Input() pedido: any;
  resumo: Array<ProdutoDTO> = [];

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.criarResumoPedido();
  }

  criarResumoPedido() {

    if (!this.pedido) {
      return;
    }

    let objMacarrao = new ProdutoDTO();
    let objBiscoito = new ProdutoDTO();
    let objFarinha = new ProdutoDTO();
    let objRevenda = new ProdutoDTO();

    for (const item of this.pedido.itensDoPedido) {

      console.log(item);

      if (item.produtoEspecie === 1) {
        objMacarrao.tipo = 'MACARRÃO';
        this.somarValoresAoGrupoProduto(item, objMacarrao);
      }

      if (item.produtoEspecie === 2) {
        objBiscoito.tipo = 'BISCOITO';
        this.somarValoresAoGrupoProduto(item, objBiscoito);
      }

      if (item.produtoEspecie === 4) {
        objFarinha.tipo = 'FARINHAS';
        this.somarValoresAoGrupoProduto(item, objFarinha);
      }

      if (item.produtoEspecie === 6) {
        objRevenda.tipo = 'REVENDA';
        this.somarValoresAoGrupoProduto(item, objRevenda);
      }
    }
  }

  somarValoresAoGrupoProduto(item: any, objProduto: ProdutoDTO) {

    console.log('entrei na soma');

    objProduto.qtde = (objProduto.qtde == null ? 0 : objProduto.qtde) + 1;
    objProduto.volume = (objProduto.volume == null ? 0 : objProduto.volume) + (+item.qtdeproduto);
    objProduto.peso = (objProduto.peso == null ? 0 : objProduto.peso) + (item.qtdeproduto * (+item.produtoPesobruto));
    objProduto.valor = (objProduto.valor == null ? 0 : objProduto.valor) + (item.qtdeproduto * (+item.precovenda));

    objProduto.peso = +objProduto.peso.toFixed(2);
    if (!this.testarProdutoJaEstaNoArray(objProduto)) {
      this.resumo.push(objProduto);
    }
  }

  testarProdutoJaEstaNoArray(objProduto: ProdutoDTO): boolean {
    const position = this.resumo.findIndex((objProd: ProdutoDTO) => {
      return objProd.tipo === objProduto.tipo;
    });

    return position > -1;
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
