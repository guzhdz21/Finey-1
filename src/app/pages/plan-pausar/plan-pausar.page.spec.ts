import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanPausarPage } from './plan-pausar.page';

describe('PlanPausarPage', () => {
  let component: PlanPausarPage;
  let fixture: ComponentFixture<PlanPausarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPausarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanPausarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
