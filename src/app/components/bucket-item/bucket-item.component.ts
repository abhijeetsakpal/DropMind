import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BucketItem } from '../../models/bucket-item.model';

@Component({
  selector: 'app-bucket-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bucket-item.component.html',
  styleUrls: ['./bucket-item.component.css']
})
export class BucketItemComponent {
  @Input() item!: BucketItem;
  @Output() delete = new EventEmitter<string>();

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.item.id);
  }

  async onCopy(event: Event) {
    event.stopPropagation();
    try {
      let copyContent = '';
      
      if (this.item.type === 'file') {
        // For files, create a downloadable content format
        copyContent = `File: ${this.item.title}\nPath: ${this.item.content}\nType: ${this.item.type}\nCreated: ${this.item.createdAt}`;
      } else {
        copyContent = this.item.content;
      }
      
      await navigator.clipboard.writeText(copyContent);
      
      // Visual feedback
      const button = event.target as HTMLElement;
      const originalText = button.textContent;
      button.textContent = '✓';
      button.style.background = '#10b981';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  onItemClick() {
    if (this.item.type === 'link') {
      const url = this.item.content.startsWith('http') ? this.item.content : `https://${this.item.content}`;
      window.open(url, '_blank');
    }
  }

  onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      // Set drag data based on item type
      if (this.item.type === 'link') {
        event.dataTransfer.setData('text/uri-list', this.item.content);
        event.dataTransfer.setData('text/plain', this.item.content);
      } else {
        event.dataTransfer.setData('text/plain', this.item.content);
      }
      
      // Set drag effect
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  getTypeBadgeClass(): string {
    return `type-badge ${this.item.type}`;
  }
}