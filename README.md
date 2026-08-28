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