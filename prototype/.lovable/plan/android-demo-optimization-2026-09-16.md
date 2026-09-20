# Android demo optimization

## Scope
- Preserve every existing Wayora screen, interaction, route, stay flow, map, and design token.
- Present the prototype in a fixed 390×844 app surface, centered on larger displays and filling Android-sized screens without horizontal overflow.
- Add safe-area handling so top bars, scrolling content, and bottom navigation remain comfortable around Android display cutouts and gesture areas.
- Add home-screen install metadata so Wayora launches in standalone portrait mode without browser controls.
- Add matching Wayora app icons and theme metadata using the existing purple identity.
- Verify the complete flow at 390×844 and confirm the install metadata and production build are valid.

## Technical details
- Use a manifest-only PWA setup; no service worker or offline caching will be introduced.
- Keep the existing local prototype state and navigation unchanged.
- Apply sizing through the shared app shell and global styles rather than redesigning individual screens.
