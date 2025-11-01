import { Component } from '@angular/core';
import { BucketListComponent } from './components/bucket-list/bucket-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BucketListComponent],
  template: '<app-bucket-list></app-bucket-list>'
})
export class AppComponent {}