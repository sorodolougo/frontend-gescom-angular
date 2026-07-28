import { Component, inject, OnInit, signal } from '@angular/core';

// Imports des modules NG-ZORRO requis

import { CommonModule } from '@angular/common';
import { AppTextComponent } from '../../shared/components/text.component';
import { SHARED_ZORRO_MODULES } from '../../shared/components/ui-components';
import { AppPageLayoutComponent } from '../../shared/components/page-layout.component';
import { ProductDetails } from '../commercial/stock/product-details/product-details';



@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [
    CommonModule,
    AppTextComponent,
    SHARED_ZORRO_MODULES,
    

  ], 
 
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {



}
