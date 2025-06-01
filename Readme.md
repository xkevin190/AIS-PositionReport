# AIS-PositionReport 

AIS is used by vessels to broadcast their position, speed, and course to avoid collisions. This system connects to `aisstream.io` to ingest real-time AIS PositionReport messages and visualizes vessel data on a map for mobile users.

App Example


https://github.com/user-attachments/assets/bad8eec6-2c44-4864-aac6-8b9961a8d070


## Tecnologies 

Frontend 

1) React Native CLI
2) Mapbox
3) Redux Toolkit 
4) Fetch
5) TypeScript

Backend 

1) NestJS
2) MongoDB 
3) Webscoket 
4) aisstream.io
5) TypeScript

## Architecture 

The application will be developed using the Flux architecture to prioritize modularity and ensure a clear separation between business logic and the views.

```
              +-----------+
              /             \
             /               \
    +--------+    View        +---------+
    |        \               /          |
    |         +-----------+-+           |
    |                     |             |
    |                     v             |
    |              +-----------+        |
    |              |  Actions  |        |
    |              +-----------+        |
    |                     |             |
    |       (Async call)  v             |
    |             +---------------+     |
    |             |  API Request  |     |
    |             +---------------+     |
    |                     |             |
    |                     v             |
    |             +---------------+     |
    |             |  Dispatcher   |     |
    |             +---------------+     |
    |                     |             |
    |                     v             |
    |              +-----------+        |
    |              |   Store   |--------+
    |              +-----------+
    |                     |
    +---------------------+
```


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
│   ├── /hooks               
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


```
/backend
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
│   │   └── vessel.schema.ts  
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

