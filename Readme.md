# AIS-PositionReport 

AIS is used by vessels to broadcast their position, speed, and course to avoid collisions. This system connects to `aisstream.io` to ingest real-time AIS PositionReport messages and visualizes vessel data on a map for mobile users.


## Tecnologies 

Frontend 

1) React Native CLI
2) Mapbox
3) Redux Toolkit 
4) Fetch
5) TypeScript

Backend 

1) NestJS
2) MongoDB ----> Optional but not definitive
3) Webscoket 
4) aisstream.io
5) TypeScript

## Architecture 

The application will be developed using the Flux architecture to prioritize modularity and ensure a clear separation between business logic and the views.


![Screenshot 2025-05-27 at 13 16 04](https://github.com/user-attachments/assets/61097b55-edd9-4bde-83fc-f17f9d7bbc52)



## 📁 Folder Structure

```
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

/backend
```
src/
│
├── app.module.ts
├── main.ts
│
├── ais/
│   ├── ais.module.ts
│   ├── ais.service.ts
│   ├── ais.gateway.ts
├── vessels/
│   ├── vessels.controller.ts
│   ├── vessels.module.ts
│   ├── vessels.service.ts
│   ├── entities/
│   │   └── vessel.schema.ts       # Esquema Mongoose optimizado
│   └── dto/
│       └── search-vessels.dto.ts
```

## WorkFlow

```
Fronted
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

backend
+------------------------------------------------+
         ┌─────────────┐
         │aisstream.io│
         └─────┬───────┘
               │ (WebSocket - PositionReport)
               ▼
        ┌─────────────────┐           ┌─────────────────┐
        │     Backend     |___________|   Database      |
        │ (Node.js, Nest) │           |                 |
        └─────────────────┘           └─────────────────┘
               │
               │
            REST API 
               │
     ┌─────────▼────────┐
     │     React Native │
     │   + Mapbox SDK   │
     └──────────────────┘
```

## references 

1) https://tonystrawberry.hashnode.dev/displaying-a-map-with-clusters-in-react-native-using-mapbox

