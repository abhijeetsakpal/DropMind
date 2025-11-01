# Smart Drag-and-Drop File Organizer

A Chrome Extension built with Angular 19 that allows users to organize text, links, and files with drag-and-drop functionality.

## Features

- ✅ Drag & drop reordering of items
- ✅ Add text, links, and file references
- ✅ Tag-based organization
- ✅ Search and filter functionality
- ✅ Export to JSON
- ✅ Context menu integration ("Add to Bucket")
- ✅ Persistent storage with IndexedDB
- ✅ Clean, responsive UI with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Extension
```bash
npm run build:extension
```

### 3. Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `dist/drop-mind` folder

### 4. Add Icons (Optional)
Place these icon files in `src/assets/icons/`:
- `icon-16.png` (16x16 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-128.png` (128x128 pixels)

## Usage

### Adding Items
1. **Via Popup**: Click the extension icon and use the form
2. **Via Context Menu**: Right-click on text/links → "Add to Bucket"
3. **Drag & Drop**: Reorder items by dragging

### Features
- **Search**: Filter items by title, content, or tags
- **Tags**: Add comma-separated tags for organization
- **Export**: Download all data as JSON
- **Clear**: Remove all items with confirmation

## Development

### Run Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build:extension
```

## Architecture

- **Angular 19**: Main framework
- **Angular CDK**: Drag & drop functionality
- **IndexedDB**: Persistent storage via `idb` library
- **Tailwind CSS**: Styling
- **Chrome APIs**: Context menus, downloads, storage

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── bucket-list/     # Main container component
│   │   └── bucket-item/     # Individual item component
│   ├── models/
│   │   └── bucket-item.model.ts
│   ├── services/
│   │   ├── storage.service.ts    # IndexedDB operations
│   │   └── chrome.service.ts     # Chrome API integration
│   └── app.component.ts
├── assets/icons/            # Extension icons
├── manifest.json           # Chrome extension manifest
├── background.js          # Service worker
└── styles.css            # Global styles
```