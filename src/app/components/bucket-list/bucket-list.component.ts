import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BucketItem } from '../../models/bucket-item.model';
import { StorageService } from '../../services/storage.service';
import { ChromeService } from '../../services/chrome.service';
import { BucketItemComponent } from '../bucket-item/bucket-item.component';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BucketItemComponent],
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.css']
})
export class BucketListComponent implements OnInit {
  items: BucketItem[] = [];
  filteredItems: BucketItem[] = [];
  searchTerm = '';
  isDarkMode = false;
  isDragOver = false;
  showAddForm = false;
  
  newItem = {
    type: 'text' as 'text' | 'link' | 'file',
    title: '',
    content: '',
    tags: [] as string[]
  };
  
  tagInput = '';

  constructor(
    private storageService: StorageService,
    private chromeService: ChromeService
  ) {}

  async ngOnInit() {
    await this.loadItems();
    this.listenForMessages();
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  async loadItems() {
    this.items = await this.storageService.getAllItems();
    this.filterItems();
  }

  filterItems() {
    if (!this.searchTerm) {
      this.filteredItems = [...this.items];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredItems = this.items.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
  }

  async addItem() {
    if (!this.newItem.title.trim()) return;
    
    // Validate based on type
    if (this.newItem.type === 'link' && !this.isValidUrl(this.newItem.content)) {
      alert('Please enter a valid URL');
      return;
    }
    
    if (this.newItem.type === 'file' && !this.newItem.content.trim()) {
      alert('Please select a file');
      return;
    }
    
    const tags = this.tagInput.split(',').map(t => t.trim()).filter(t => t);
    
    await this.storageService.addItem({
      ...this.newItem,
      tags
    });
    
    this.resetForm();
    await this.loadItems();
    this.showAddForm = false;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  onTypeChange() {
    this.newItem.content = '';
    this.newItem.title = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  removeFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.newItem.content = '';
    this.newItem.title = '';
  }

  getFileIcon(): string {
    const fileName = this.newItem.content.toLowerCase();
    if (fileName.includes('.pdf')) return '📄';
    if (fileName.includes('.doc') || fileName.includes('.docx')) return '📝';
    if (fileName.includes('.xls') || fileName.includes('.xlsx')) return '📊';
    if (fileName.includes('.ppt') || fileName.includes('.pptx')) return '📈';
    if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.gif')) return '🖼️';
    if (fileName.includes('.mp4') || fileName.includes('.avi') || fileName.includes('.mov')) return '🎥';
    if (fileName.includes('.mp3') || fileName.includes('.wav')) return '🎵';
    if (fileName.includes('.zip') || fileName.includes('.rar')) return '🗜️';
    return '📁';
  }

  private handleFile(file: File) {
    // Store file path (webkitRelativePath or name)
    const filePath = (file as any).webkitRelativePath || file.name;
    this.newItem.content = filePath;
    
    if (!this.newItem.title.trim()) {
      this.newItem.title = file.name.split('.')[0];
    }
  }

  getTitlePlaceholder(): string {
    switch (this.newItem.type) {
      case 'text': return 'Enter title';
      case 'link': return 'Website name or title';
      case 'file': return 'File description';
      default: return 'Title';
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async deleteItem(id: string) {
    await this.storageService.deleteItem(id);
    await this.loadItems();
  }

  async drop(event: CdkDragDrop<BucketItem[]>) {
    moveItemInArray(this.filteredItems, event.previousIndex, event.currentIndex);
    await this.storageService.updateItemOrder(this.filteredItems);
    await this.loadItems();
  }

  async exportJSON() {
    const data = await this.storageService.exportData();
    this.chromeService.downloadFile('bucket-export.json', data);
  }

  async clearAll() {
    if (confirm('Clear all items?')) {
      await this.storageService.clearAll();
      await this.loadItems();
    }
  }

  private resetForm() {
    this.newItem = { type: 'text', title: '', content: '', tags: [] };
    this.tagInput = '';
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private listenForMessages() {
    if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
      (window as any).chrome.runtime.onMessage.addListener((message: any) => {
        if (message.action === 'addToBucket') {
          this.newItem = {
            type: message.data.type || 'text',
            title: message.data.title || '',
            content: message.data.content || '',
            tags: []
          };
        }
      });
    }
  }
}