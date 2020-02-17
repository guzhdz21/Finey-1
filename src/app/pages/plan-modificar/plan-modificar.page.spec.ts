import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanModificarPage } from './plan-modificar.page';

describe('PlanModificarPage', () => {
  let component: PlanModificarPage;
  let fixture: ComponentFixture<PlanModificarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanModificarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanModificarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
