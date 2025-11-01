export interface BucketItem {
  id: string;
  type: 'text' | 'link' | 'file';
  title: string;
  content: string;
  url?: string;
  tags: string[];
  createdAt: Date;
  order: number;
}

export interface ExportData {
  items: BucketItem[];
  exportedAt: Date;
}