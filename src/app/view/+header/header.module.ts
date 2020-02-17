import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ImporterModule } from '@evley/importer';

import { HeaderComponent } from './header.component';

@NgModule({
  imports: [CommonModule, MatToolbarModule, ImporterModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {}
