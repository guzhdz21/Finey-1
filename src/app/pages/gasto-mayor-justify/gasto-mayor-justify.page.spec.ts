import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GastoMayorJustifyPage } from './gasto-mayor-justify.page';

describe('GastoMayorJustifyPage', () => {
  let component: GastoMayorJustifyPage;
  let fixture: ComponentFixture<GastoMayorJustifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastoMayorJustifyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GastoMayorJustifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
