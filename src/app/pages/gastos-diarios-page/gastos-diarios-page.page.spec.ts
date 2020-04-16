import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GastosDiariosPagePage } from './gastos-diarios-page.page';

describe('GastosDiariosPagePage', () => {
  let component: GastosDiariosPagePage;
  let fixture: ComponentFixture<GastosDiariosPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GastosDiariosPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GastosDiariosPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
