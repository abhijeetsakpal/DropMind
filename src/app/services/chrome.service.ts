import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChromeService {
  
  sendMessage(message: any): Promise<any> {
    return new Promise((resolve) => {
      if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
        (window as any).chrome.runtime.sendMessage(message, resolve);
      } else {
        resolve(null);
      }
    });
  }

  downloadFile(filename: string, content: string, type: string = 'application/json'): void {
    if (typeof (window as any).chrome !== 'undefined' && (window as any).chrome.downloads) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      (window as any).chrome.downloads.download({
        url,
        filename,
        saveAs: true
      });
    } else {
      // Fallback for development
      const element = document.createElement('a');
      element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }
}