import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GastosMayoresPage } from './gastos-mayores.page';

describe('GastosMayoresPage', () => {
  let component: GastosMayoresPage;
  let fixture: ComponentFixture<GastosMayoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosMayoresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GastosMayoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
