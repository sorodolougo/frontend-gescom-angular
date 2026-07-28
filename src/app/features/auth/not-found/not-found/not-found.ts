import { Component } from '@angular/core';
import { SHARED_ZORRO_MODULES } from '../../../../shared/components/ui-components';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    CommonModule,
    SHARED_ZORRO_MODULES,
    RouterLink
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
