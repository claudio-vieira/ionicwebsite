import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResumoPedidoPage } from './resumo-pedido.page';

describe('ResumoPedidoPage', () => {
  let component: ResumoPedidoPage;
  let fixture: ComponentFixture<ResumoPedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumoPedidoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumoPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
