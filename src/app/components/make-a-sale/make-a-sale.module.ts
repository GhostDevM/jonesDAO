import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MakeASaleRoutingModule } from './make-a-sale-routing.module';
import { ProductSaleComponent } from './product-sale/product-sale.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HighlightDirective } from '../shared/directives/highlight.directive';
import { FilterPipe } from '../shared/pipes/filter.pipe';
import { ClientsService } from 'app/config/config.service.clients';

@NgModule({
  declarations: [ProductSaleComponent,HighlightDirective,FilterPipe],
  providers: [ ClientsService],
  imports: [
    CommonModule,
    MakeASaleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ]
})
export class MakeASaleModule { }
