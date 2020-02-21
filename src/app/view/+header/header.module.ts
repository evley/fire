import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImporterModule } from '@evley/importer';

import { HeaderComponent } from './header.component';

@NgModule({
  imports: [CommonModule, ImporterModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {}
