 🌐 Overview

AIS is used by vessels to broadcast their position, speed, and course to avoid collisions. This system connects to `aisstream.io` to ingest real-time AIS PositionReport messages and visualizes vessel data on a map for mobile users.


## FrontEnd

## Tecnologies 

1) React Native CLI
2) Mapbox
3) Redux Toolkit 
4) Fetch

## architecture 

The application will be developed using the Flux architecture to prioritize modularity and ensure a clear separation between business logic and the views.


## 📁 Folder Structure

/frontend
├── /src         
│   ├── /AIS
│   │     ├── components/
│   │     ├── hooks/
│   │     ├── AISStore/
│   │     ├── views/
│   │     ├── types.ts
│   ├── /hooks               # Global Hooks
│   ├── /services
│   │        |
|   |        |── API Service
|   |               
│   ├── /store                 
│   ├── /types                 
│   ├── /utils              
│   └── App.tsx
├── .env
└── package.json
```


## WorkFlow


+--------------------------------+
|      🚀 App Initialization     |
+--------------------------------+
               |
               v
+------------------------------------------------+
| 📍 Get initial coordinates                     |
|   (user location or default map position)      |
+------------------------------------------------+
               |
               v
+------------------------------------------------+
| 🗺️ Render initial map view                     |
+------------------------------------------------+
               |
               v
+------------------------------------------------+
| ⏱️ Start polling loop every 10 seconds         |
+------------------------------------------------+
               |
               v
+------------------------------------------------+
| 📦 Send current map bounds (bounding box) to   |
|     backend to fetch vessels in the area       |
+------------------------------------------------+
               |
               v
+------------------------------------------------+
| 📬 Receive and render vessel data              |
|   (only fresh and inside the visible area)     |
+------------------------------------------------+
               |
               v
+------------------------------------------------+
| 🔄 Did the user move or change the map view?   |
+------------------------------------------------+
           /           \
         Yes            No
         |               |
         v               v
+------------------------------------------------+     (✔️ Continue polling using previous bounds)
| 📍 Update bounding box and use it              |
|     in the next polling request                |
+------------------------------------------------+




+------------------------------------------------+


         ┌─────────────┐
         │aisstream.io│
         └─────┬───────┘
               │ (WebSocket - PositionReport)
               ▼
        ┌─────────────────┐
        │     Backend     │
        │ (Node.js, Nest) │
        └─────────────────┘
               │
        ┌──────┴──────────────┐
        │    database         │
        └─────────────────────┘
               │
            REST API 
               │
     ┌─────────▼────────┐
     │     React Native │
     │   + Mapbox SDK   │
     └──────────────────┘
