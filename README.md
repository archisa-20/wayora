# Wayora Journey

Continue the existing Wayora app from exactly where the previous task stopped. Do NOT rebuild, redesign, or duplicate anything. Preserve the existing UI, design system, navigation, screens, and all completed stay/map components.

Finish ONLY the remaining integration and build fixes:

1. MAIN APP WIRING

- Add selected stays to the existing trip state.

- Show the new dynamic Stays/Discovery section after the user selects/finalizes an itinerary.

- Show the stay summary in Trip Overview.

- Ensure selected stays persist while navigating between screens.

2. ACTIVE TRIP MAP

- Replace the old static active-trip map with the completed simulated live navigation map.

- Connect it to the existing trip/route state.

- Show current location, travelled route, remaining route, stops, next stop, ETA and progress.

- Make “Simulate Progress” work and update the map/state each time.

- Fix the existing Simulate Progress prop/handler mismatch that currently breaks the active-trip screen.

- Show Arrived state and “Continue Trip”.

3. VERIFY

- Make sure the entire app builds without errors.

- Check the full flow:

Trip Setup → Route → Itinerary → Recommended Stays → Stay Selection → Trip Overview → Start Trip → Simulated Live Navigation.

- Reuse existing components/data. No new redesigns.

- Use mock/local state only; no real GPS, maps, booking or external APIs.

Do not make any other changes.

This project was built with [Lovable](https://lovable.dev).

## Repository Architecture

The repository keeps the existing React prototype and provides a Flutter-ready
mobile application under `android/`:

```text
android/
├── lib/
│   ├── app/       # Application bootstrap and app-level wiring
│   ├── core/      # Shared infrastructure and theme
│   ├── features/  # Feature-specific UI and domain code
│   └── shared/    # Reusable widgets and utilities
├── test/          # Flutter widget and unit tests
├── android/      # Native Android host project files
├── pubspec.yaml
└── analysis_options.yaml
```

`backend/` and `ml/` are reserved for future services and model code. The
React prototype remains independently runnable from `prototype/`.

**Live app**: https://wayora-trips.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/18249766-45ea-4f9c-ae91-3608baa8885a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
