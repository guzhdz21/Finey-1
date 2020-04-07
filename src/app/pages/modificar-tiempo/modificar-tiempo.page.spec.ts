import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificarTiempoPage } from './modificar-tiempo.page';

describe('ModificarTiempoPage', () => {
  let component: ModificarTiempoPage;
  let fixture: ComponentFixture<ModificarTiempoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarTiempoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarTiempoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
