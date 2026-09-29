# Alderwick town website

A responsive, dependency-free static presentation website. The deployable files are in this folder.

## Run and deploy

Preview locally with `python3 -m http.server 8000 ` and open http://localhost:8000. Upload the contents of this folder to any static host. No build step, environment variables, API keys, or backend are required.

## Customize before a real town launch

Alderwick, attractions and events are fictional example content. Replace the town name, copy and visitor guidance in `index.html`, plus the `places`, `events` and `gallery` arrays in `app.js`. Events currently use October 2026 sample dates. Calendar downloads use floating local times; set a real timezone when adapting for a real town. Update page title, description, favicon and photographs. Photography depicts actual English locations, not Alderwick; attribution is linked from the footer. Preserve the CC BY-SA attribution and applicable licensing or supply your own images.

Colors, layout and all responsive rules are in `style.css`. Fonts load from Google Fonts, with local fallback fonts. For fully self-hosted use, bundle licensed font files or remove the CSS import.

## Functionality

Mobile navigation, category and text filters, place detail dialogs, event filters, calendar (.ics) downloads, local day planner with text download, expandable FAQs, keyboard-accessible photo gallery, and reduced-motion support. The day planner uses localStorage only; it does not send or share personal data. The site requires JavaScript for discovery cards and events. No contact form, bookings or mailing service is implied.

## Verification

JavaScript syntax and local asset/link references checked. Manual browser QA remains recommended before a public launch, including iOS/Android, keyboard navigation, 200% zoom and target browsers.
