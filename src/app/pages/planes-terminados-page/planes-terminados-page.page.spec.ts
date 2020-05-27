import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanesTerminadosPagePage } from './planes-terminados-page.page';

describe('PlanesTerminadosPagePage', () => {
  let component: PlanesTerminadosPagePage;
  let fixture: ComponentFixture<PlanesTerminadosPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanesTerminadosPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanesTerminadosPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
