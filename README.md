# Lead Capture Automation with n8n

An n8n automation workflow that captures website lead submissions, validates the data, saves valid leads in Google Sheets, and sends an instant Telegram notification.

## Workflow architecture

```text
Website Form
    ↓
Webhook
    ↓
Edit Fields
    ↓
IF Validation
    ↓
Google Sheets
    ↓
Telegram Notification
```

## Features

- Receives lead data through a POST webhook
- Normalizes lead details before processing
- Validates required fields: name, email, service, and message
- Saves valid leads in Google Sheets
- Sends an instant Telegram notification after successful storage

## Lead fields

- Full name
- Email
- Phone
- Service
- Message
- Created at
- Lead status
- Source

## Tech stack

- n8n
- Webhooks
- Google Sheets API
- Telegram Bot API

## Version history

### v1 — Initial workflow

- Webhook receives lead data
- Edit Fields normalizes the input
- IF node validates required fields
- Google Sheets stores valid leads
- Telegram sends a notification

## Setup

1. Import `lead-capture-v1.json` into n8n.
2. Connect your Google Sheets credentials.
3. Connect your Telegram Bot credentials.
4. Create a Google Sheet with this header row:

```text
full_name | email | phone | service | message | created_at | lead_status | source
```

5. Replace `YOUR_TELEGRAM_CHAT_ID` with your own Telegram chat ID.
6. Select your own Google Sheet in the Google Sheets node.
7. Test the workflow with a POST request to the webhook.
