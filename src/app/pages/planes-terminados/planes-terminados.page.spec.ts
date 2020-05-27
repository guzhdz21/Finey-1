import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanesTerminadosPage } from './planes-terminados.page';

describe('PlanesTerminadosPage', () => {
  let component: PlanesTerminadosPage;
  let fixture: ComponentFixture<PlanesTerminadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanesTerminadosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanesTerminadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
