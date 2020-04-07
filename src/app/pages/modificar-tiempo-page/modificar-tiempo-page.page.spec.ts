import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificarTiempoPagePage } from './modificar-tiempo-page.page';

describe('ModificarTiempoPagePage', () => {
  let component: ModificarTiempoPagePage;
  let fixture: ComponentFixture<ModificarTiempoPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarTiempoPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarTiempoPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
