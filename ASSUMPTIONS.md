# Assumptions

These are the assumptions and scope decisions behind this proof of concept.

## Scope

- **Leads are kept in memory only.** The list is built from leads received while the app is open. Reloading the app clears it. Persistence (a database or a "fetch recent leads" endpoint) was out of scope for a live-delivery PoC.
- **One Page and one form.** The server handles whichever `leadgen_id` Meta sends, but I tested with a single Page and a single Instant Form.
- **Leads come from Meta's Lead Ads Testing Tool**, as the brief asks. No real ads were run.
- **Test leads contain dummy data.** The tool fills fields such as `full_name` and `email` with placeholder values unless edited, so the app displays whatever Meta returns.

## Architecture

- **A webhook only carries an ID.** Meta's `leadgen` webhook contains a `leadgen_id`, so the server fetches the full lead from the Graph API (v26.0) using a Page access token.
- **WebSocket for live delivery.** I chose WebSockets over polling or push notifications so that a lead appears in an already-open screen immediately and without a request from the device.
- **The server broadcasts to every connected client.** There is no authentication or per-user routing, which is acceptable for a single-user demo.
- **Duplicate webhooks are ignored.** Meta can deliver the same event more than once, so the app deduplicates by lead `id`.

## Environment

- **The server runs on my laptop and is exposed through an ngrok static domain.** Meta must reach the webhook over public HTTPS, so the laptop and ngrok need to be running during the demo.
- **Phone and laptop are on the same Wi-Fi.** The app connects to the WebSocket at the laptop's local IP, derived from the Expo dev server's host. `EXPO_PUBLIC_WS_URL` overrides this.
- **The Page access token is long-lived and non-expiring.** It is derived from a long-lived user token that has `leads_retrieval`, `pages_manage_ads`, `pages_read_engagement`, `pages_show_list` and `pages_manage_metadata`.
- **The Meta app is published (Live mode)**, which was needed for webhook delivery from the Testing Tool.

## Not included

- Production hosting (a deployed server would replace the laptop and ngrok).
- Webhook signature verification (`X-Hub-Signature-256`), which I would add before production use.
- Push notifications when the app is closed. The brief only requires the app to already be open.