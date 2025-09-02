# Helsinki City Bikes

A friendly, responsive web app for exploring city bike **stations** and **journeys** in the Helsinki Capital area.

> This started as Solita’s [Dev Academy pre-assignment](https://github.com/solita/dev-academy-2023-exercise) and grew into a hobby project.    
> Live demo: **[HCB – Helsinki City Bikes](https://hsl-ui.netlify.app)**

## 📸 Preview

| Desktop View | Mobile View |
| :---: | :---: |
| ![Desktop](https://github.com/user-attachments/assets/3d75823a-77a5-4215-9b65-781d198818b0) | ![Mobile](https://github.com/user-attachments/assets/4e1eb096-8876-4174-8b74-5ac81776f74d) |

---

## Why this refactor?

I rebuilt the app to make it **faster**, **easier to work on**, and **better on mobile**.

### The big changes
- **From CRA to Vite (React + Vite)**
  - Vite starts the dev server almost instantly and produces smaller builds.
  - New scripts:
    - `npm run dev` – start the app in development
    - `npm run build` – create a production build
    - `npm run preview` – preview the production build locally

- **Mobile-first, responsive UI**
  - Works great on phones: bottom navigation, modal details, readable lists.
  - Desktop gets tables, side-by-side layouts, and more screen real estate.
  - The map renders reliably on all screen sizes.

- **Clear project structure**
  - Reusable components live in `src/components/`
  - Screens live in `src/pages/`
  - API helpers live in `src/service/`
  - Easier to find things, easier to extend.

- **Quality-of-life improvements**
  - Consistent toasts for success/error messages.
  - Modernized MUI usage (e.g., Grid v2, updated TextField API).
  - Sorting, searching, pagination across lists.

---


## What you can do in the app

- **Home:** Explore stations on an interactive map (with clustering).
- **Journeys:** Browse trips with sorting (by Departure, Return, Distance, Duration) and pagination.
- **Stations:** Search and browse stations with pagination and sorting.
- **Single Station:** See details, a map pin, and totals of journeys from/to that station.
- **Add Station:** Submit a new station with real-time validation and clear feedback.

---


## Tech Stack

**UI**
- React 18
- Vite
- Material UI (MUI)
- React Leaflet (+ Marker Cluster)

**API / DB**
- Node.js + Express
- MongoDB + Mongoose

---

## Data Sources

**Journeys**
- May–July 2021 trips:
  - https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv  
  - https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv  
  - https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv  

**Stations**
- https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv

**Import constraints**
- Only journeys with `duration > 10s` and `covered_distance > 10m`
- Skip journeys with undefined/null station ids
- UI fetches up to `5000` journeys (client-side pagination)

---


- **State management**: React hooks (`useState`, `useEffect`, `useMemo`) — no external state lib.
- **API layer**: Single axios instance; pages call `service/api` helpers.
- **UI patterns**: Tables on desktop; card lists on mobile; consistent spacing/typography via MUI.

---

## Local Development

> Requires **Node 18+** (Vite 5 needs Node ≥ 18).

### 1) Clone + install

```bash
# UI
cd hsl/hsl-client
npm install

# Server
cd hsl/hsl-server
npm install
````

### 2) Run

```bash
# UI (Vite)
cd hsl-client
npm run dev                 # http://localhost:5173

# Server (Express)
cd hsl-server
nodemon app.js          # http://localhost:8000
```

## API Quick Reference

### GET `/journeys`
**Query params**
- `limit` — max items to return (default: 5000)
- `page` — page index starting at 1 (used with `limit`)
- `display` — `list` (default) or `count`
- `departureStationId` — filter by departure station id
- `returnStationId` — filter by return station id

**Server-side filters**
- `duration > 10` seconds  
- `covered_distance > 10` meters

**Examples**
```http
GET /journeys?limit=5000&page=1
GET /journeys?display=count&departureStationId=501
GET /journeys?display=count&returnStationId=501
```

### GET `/stations`
```http
GET /stations
```

### GET `/stations/:id`
```http
GET /stations/501
```

### POST `/addStation`
Create a new station.

```json
{
  "fid": 123,
  "id": 501,
  "nimi": "Kamppi (fi)",
  "namn": "Kampen (sv)",
  "name": "Kamppi (en)",
  "osoite": "Urho Kekkosen katu 1",
  "address": "Urho Kekkosen St 1",
  "kaupunki": "Helsinki",
  "stad": "Helsingfors",
  "operaattor": "CityBike Finland",
  "kapasiteet": 28,
  "x": 24.931,
  "y": 60.170
}
```
---


## Final notes

- This project is a learning playground—it began as an assignment and evolved into a hobby refactor focused on speed (Vite), structure (clear folders), and accessibility/responsiveness.
- There’s room for more (date filters, server-side paging, maps for journeys, etc.). PRs and ideas welcome!
