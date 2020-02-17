import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UltimoPedidoPage } from './ultimo-pedido.page';

describe('UltimoPedidoPage', () => {
  let component: UltimoPedidoPage;
  let fixture: ComponentFixture<UltimoPedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltimoPedidoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UltimoPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
