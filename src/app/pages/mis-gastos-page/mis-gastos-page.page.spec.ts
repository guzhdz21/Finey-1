import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MisGastosPagePage } from './mis-gastos-page.page';

describe('MisGastosPagePage', () => {
  let component: MisGastosPagePage;
  let fixture: ComponentFixture<MisGastosPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisGastosPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MisGastosPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
