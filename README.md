# weather-app

This is a purly JS based weather app. It uses free weather API from open-meteo.com

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Project Details

### location
navigator.geolocation.getCurrentPosition is used to get user's current location

### timezone
Intl.DateTimeFormat().resolvedOptions().timeZone is used to get user's current timezone

### formatter
two formatter is created using Intl.DateTimeFormat to generate formatted day and hour for display.
