## 🚀 Overview

**DropMind** is a Chrome Extension built using **Angular 18** that lets users drag files, text, or links into a sidebar “bucket” to organize or tag them.  
All data is stored locally using **IndexedDB**, and users can export it to **JSON or CSV** for later use.

## ✨ Features

- 🧩 Built entirely with Angular (SPA inside Chrome Extension)  
- 🎯 Drag-and-Drop using Angular CDK  
- 💾 Persistent storage using IndexedDB  
- 🧠 Context Menu integration ("Add to DropMind Bucket")  
- 📤 Export to JSON or CSV  
- ⚙️ Chrome Manifest V3 compatible  
---

## 🛠️ Tech Stack

- **Angular 18+**
- **TypeScript**
- **Angular CDK (DragDropModule)**
- **IndexedDB (`idb` library)**
- **Chrome Extension APIs (Manifest V3)**
- 
## Development server
To start a local development server, run:

```bash
ng serve
```
## Building
To build the project run:

```bash
npm run build:extension
```
