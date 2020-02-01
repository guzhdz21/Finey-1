import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DescripcionGastoPage } from './descripcion-gasto.page';

describe('DescripcionGastoPage', () => {
  let component: DescripcionGastoPage;
  let fixture: ComponentFixture<DescripcionGastoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescripcionGastoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DescripcionGastoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
