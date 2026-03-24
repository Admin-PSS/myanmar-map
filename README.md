# Myanmar Interactive Map · မြန်မာပြည်မြေပုံ

An interactive, browser-based map of Myanmar built with React and Leaflet. Explore every State and Region, Township, and Town/City layer, apply custom colours and labels to any administrative unit, and import or export your styling data as CSV — all without a backend.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Three map layers** | Toggle *States / Regions*, *Townships*, and *Towns & Cities* on/off independently |
| **Click-to-style** | Click any polygon or point to open the Style Editor for that feature |
| **Style Editor** | Customise fill colour, border colour & width, label text & colour, category tag, and a free-text description |
| **CSV import** | Drag-and-drop or browse a CSV file to bulk-apply styles to many features at once |
| **Sample data** | Load a built-in sample dataset with one click to see the map styled right away |
| **CSV export** | Download your current styling as a CSV file for reuse or sharing |
| **Dynamic legend** | The sidebar legend updates automatically to reflect active layers and category colours |
| **State filter** | Filter townships by State / Region with automatic map zoom |
| **State border overlay** | Optional state border overlay on the Township map with customisable colour and width |
| **Plain background toggle** | Switch between standard OpenStreetMap tiles and a plain CARTO basemap (no labels) |
| **GeoJSON caching** | GeoJSON files are fetched once and cached in memory to avoid redundant network requests |

---

## 🛠 Tech Stack

| Library | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite 6](https://vitejs.dev) | Build tool & dev server |
| [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org) | Interactive map rendering |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| [PapaParse](https://www.papaparse.com) | CSV parsing and generation |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Admin-PSS/myanmar-map.git
cd myanmar-map

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server with hot-reload |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally for testing |

---

## 🗺 Map Layers

### States / Regions *(State Map tab)*
Myanmar's 15 top-level administrative divisions, each pre-coloured and labelled. Options include:
- Toggle individual state colours on/off
- Show/hide state name labels
- Override global fill and border colour
- Switch to a plain background basemap

| P-Code | Name | | P-Code | Name |
|---|---|---|---|---|
| MMR001 | Ayeyarwady | | MMR009 | Mon |
| MMR002 | Bago | | MMR010 | Naypyidaw Union Territory |
| MMR003 | Chin | | MMR011 | Rakhine |
| MMR004 | Kachin | | MMR012 | Sagaing |
| MMR005 | Kayah | | MMR013 | Shan |
| MMR006 | Kayin | | MMR014 | Tanintharyi |
| MMR007 | Magway | | MMR015 | Yangon |
| MMR008 | Mandalay | | | |

### Townships *(Township Map tab)*
District-level township boundary polygons, styled with a neutral grey by default. Additional options:
- **State Filter** — select a State / Region from a dropdown to zoom in and show only its townships
- **Show township labels** — renders the township name on each polygon
- **State Border Overlay** — draws state-level borders on top of the township layer with a customisable colour and line width

### Towns & Cities *(Township Map tab)*
Point layer (city/town/village markers) rendered as coloured circles:

| Type | Colour |
|---|---|
| City | Red |
| Town | Blue |
| Village | Green |

---

## 📄 CSV Attribute Data Format

You can import a CSV file to apply styling to multiple features at once. The file must contain at least the **`PCODE`** and **`FILL_COLOR`** columns; all other columns are optional.

| Column | Required | Description | Example |
|---|:---:|---|---|
| `PCODE` | ✅ | Feature P-Code (must match a GeoJSON feature) | `MMR001` |
| `NAME` | | Display name | `Ayeyarwady` |
| `FILL_COLOR` | ✅ | Polygon fill colour (hex) | `#66BB6A` |
| `BORDER_COLOR` | | Polygon border colour (hex) | `#2E7D32` |
| `BORDER_WIDTH` | | Border line width in pixels | `2` |
| `LABEL` | | Custom label shown on the legend | `Ayeyarwady` |
| `LABEL_COLOR` | | Label text colour (hex) | `#1B5E20` |
| `CATEGORY` | | Category name for grouped legend colouring | `Coastal` |
| `DESCRIPTION` | | Free-text notes | `Fertile delta region` |

A sample CSV for states is included at [`public/data/sample_attribute_data.csv`](public/data/sample_attribute_data.csv) and for townships at [`public/data/sample_township_data.csv`](public/data/sample_township_data.csv). Click **Load Sample** in the sidebar to apply the relevant one instantly.

---

## 📁 Project Structure

```
myanmar-map/
├── public/
│   └── data/
│       ├── myanmar_states.geojson          # State/Region polygons
│       ├── myanmar_townships.geojson       # Township polygons
│       ├── myanmar_towns.geojson           # Town/City points
│       ├── sample_attribute_data.csv       # Built-in sample styling data (states)
│       ├── sample_township_data.csv        # Built-in sample styling data (townships)
│       └── ps_sample_attribute_state.csv   # Additional state attribute sample
├── src/
│   ├── components/
│   │   ├── MapView.jsx           # Leaflet map container & basemap switcher
│   │   ├── StateLayer.jsx        # State/Region polygon layer
│   │   ├── TownshipLayer.jsx     # Township polygon layer with state filter
│   │   ├── TownLayer.jsx         # Town/City point layer
│   │   ├── StateBorderLayer.jsx  # State border overlay (used in Township map)
│   │   ├── LayerControls.jsx     # Sidebar panels for State & Township tabs
│   │   ├── Legend.jsx            # Dynamic map legend
│   │   ├── StyleEditor.jsx       # Per-feature style editor panel
│   │   └── AttributeImporter.jsx # CSV import / export controls
│   ├── hooks/
│   │   └── useAttributeData.js   # State management for CSV styling data
│   ├── utils/
│   │   ├── colorUtils.js         # Default colours & category palette helpers
│   │   ├── geojsonCache.js       # In-memory GeoJSON fetch cache
│   │   └── csvParser.js          # CSV parsing, validation & export (PapaParse)
│   ├── App.jsx                   # Root component & application layout
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles (Tailwind base + custom classes)
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 🤝 Contributing

1. Fork the repository and create a feature branch (`git checkout -b feature/my-feature`)
2. Commit your changes with a descriptive message
3. Open a Pull Request describing what you changed and why

Please keep pull requests focused on a single concern and ensure the app builds without errors (`npm run build`) before submitting.

---

## 📜 License

This project is open-source. See the repository for license details.

---

> Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors