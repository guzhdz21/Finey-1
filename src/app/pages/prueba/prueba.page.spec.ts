import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PruebaPage } from './prueba.page';

describe('PruebaPage', () => {
  let component: PruebaPage;
  let fixture: ComponentFixture<PruebaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PruebaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PruebaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
