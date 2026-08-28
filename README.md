# Taller Digital — Landing Page

Landing page for a web development & automation service targeting small businesses in Spain (Guadalajara / Madrid area). One-stop shop for websites, chatbots, Google Sheets integrations, and process automation.

## Overview

The site presents a portfolio of past work (restaurant website, movie search site, Telegram bots, Godot games) and collects leads through a brief/questionnaire form. Submissions are sent to a Google Sheet via Google Apps Script — no backend server required.

## Tech Stack

- **Frontend:** Plain HTML / CSS / JavaScript (no build tools, no framework)
- **Backend:** Google Apps Script (`Code.gs`, hosted in the linked Google Sheet, not in this repo)
- **Storage:** Google Sheets (leads) + Google Drive (uploaded reference screenshots)
- **Hosting:** Vercel (auto-deploy on push to `main`)
- **Languages:** ES (primary) / EN, toggle handled in `script.js` via a `translations` object

## Project Structure


## Features

- **Portfolio section** — demo links for live sites (Vercel/GitHub Pages), code/animation preview for bots (no live demo, since they run locally)
- **Brief form (6 questions)** — service type, task description, references (link or file upload, max 4MB), materials ready (yes/no toggle), timeline (dropdown), budget (open text)
- **Form submission** — `fetch` (mode: `no-cors`) to a Google Apps Script Web App URL (`SCRIPT_URL` constant in `script.js`)
- **Floating WhatsApp button** — currently a placeholder linking to the brief form (`#brief`) until a dedicated WhatsApp Business number is set up

## Deployment

Auto-deployed via **Vercel**, connected to this GitHub repository. Every `git push` to `main` triggers a rebuild and updates the live site (usually within 10–30 seconds). No manual steps needed on Vercel after the initial setup.

## Local Development

```bash
git add .
git commit -m "describe your changes"
git push
```

That's it — Vercel picks up the change automatically.

## Backend Setup (Google Apps Script)

The form depends on `SCRIPT_URL` in `script.js` pointing to a deployed Apps Script Web App (`Code.gs`, not stored in this repo — lives inside the linked Google Sheet). It:

- Creates a "Leads" sheet with headers on first run
- Appends each submission as a new row (8 fields + timestamp)
- Saves uploaded reference files to a Google Drive folder, writes the link back to the sheet
- Sends an email notification per new lead
- Forces the `Contacto` (phone) column to plain text format to avoid `#ERROR!` on numbers starting with `+`

## Known Limitations / TODO

- WhatsApp Business number not yet active — floating button is a temporary stub
- WhatsApp dialogue/response scripts not yet written
