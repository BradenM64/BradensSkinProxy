# BradensSkinProxy

Node.js API proxy for retrieving Minecraft player skin info.

By default, the server runs on:

```text
http://localhost:3000
```

### Get Minecraft Skin

```text
GET /api/minecraft/{username}
```

Example:

```text
GET /api/minecraft/BradenM64
```

Response:

```json
{
  "username": "BradenM64",
  "uuid": "2b8b603b45304aa58e49c753e0d08c04",
  "skinUrl": "https://..."
}
```

## Configuration

Server settings are stored in:

```text
config.json
```

The config file contains the server settings, CORS settings, and Minecraft API endpoints used by the proxy.
