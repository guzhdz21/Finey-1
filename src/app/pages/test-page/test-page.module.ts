import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestPagePageRoutingModule } from './test-page-routing.module';

import { TestPagePage } from './test-page.page';
import { ComponentsModule } from '../../components/components.module';
import { TestPage } from '../test/test.page';
import { TestPageModule } from '../test/test.module';

@NgModule({
  entryComponents: [
    TestPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestPagePageRoutingModule,
    ComponentsModule,
    TestPageModule
  ],
  declarations: [TestPagePage]
})
export class TestPagePageModule {}
