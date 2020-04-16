import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GastosDiariosPage } from './gastos-diarios.page';

describe('GastosDiariosPage', () => {
  let component: GastosDiariosPage;
  let fixture: ComponentFixture<GastosDiariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosDiariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GastosDiariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
