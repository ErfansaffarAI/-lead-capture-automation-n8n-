# Northbridge Estates: Lead Capture Landing Page

A fictional premium London estate agency website built with plain HTML, CSS and vanilla JavaScript. It is a portfolio project: the enquiry form sends leads as JSON to an n8n Production Webhook (Webhook → Edit Fields → IF → Google Sheets → Telegram).

## File structure

```
index.html          Page markup
styles.css          Styling
script.js           Menu, validation and webhook logic
config.example.js   Template for your local config
config.js           YOUR local config (gitignored, create it yourself)
.gitignore
README.md
```

## Configure the webhook

1. Copy `config.example.js` to `config.js`.
2. Open `config.js` and replace the placeholder with your n8n **Production** Webhook URL:
   ```js
   window.N8N_WEBHOOK_URL = "https://your-instance.app.n8n.cloud/webhook/your-path";
   ```
3. Never use the Test URL for the live site, and activate (publish) the workflow in n8n.

## Run locally

- VS Code: install **Live Server**, right-click `index.html`, then *Open with Live Server*.
- Or with Python: `python3 -m http.server 8000` in this folder, then open http://localhost:8000

## Connect to n8n

The webhook node must accept `POST` with JSON. The form sends exactly these fields:

```json
{ "full_name": "", "email": "", "phone": "", "service": "", "message": "" }
```

If the browser blocks the request (CORS), set **Allowed Origins** in the n8n Webhook node options (for example `*` while testing, then your real domain).

## Security warning

Do **not** commit `config.js`, tokens, API keys, Google Sheet URLs, Telegram chat IDs or production webhook URLs. `config.js` is listed in `.gitignore`. Remember that anything loaded in a browser can be seen by visitors, so the webhook URL is visible on a deployed site. Add validation and spam protection in n8n (the IF node helps).
