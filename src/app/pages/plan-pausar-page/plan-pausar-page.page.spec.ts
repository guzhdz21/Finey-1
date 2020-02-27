import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanPausarPagePage } from './plan-pausar-page.page';

describe('PlanPausarPagePage', () => {
  let component: PlanPausarPagePage;
  let fixture: ComponentFixture<PlanPausarPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPausarPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanPausarPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
