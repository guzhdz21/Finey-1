import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanModificarPagePage } from './plan-modificar-page.page';

describe('PlanModificarPagePage', () => {
  let component: PlanModificarPagePage;
  let fixture: ComponentFixture<PlanModificarPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanModificarPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanModificarPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
