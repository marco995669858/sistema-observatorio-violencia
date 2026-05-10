import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading-service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
  standalone: true,
  imports: [CommonModule],
})
export class LoadingSpinner {
  loadingService = inject(LoadingService);
}
