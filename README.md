# Washer Dryer Card

A Lovelace card for Home Assistant that gives you a clean, at-a-glance view of your washer and dryer — current state, active cycle phase, estimated time remaining, and live power draw.

[![HACS: Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Lovelace-41BDF5.svg)](https://www.home-assistant.io/)
[![Version](https://img.shields.io/badge/version-1.1.4-1565c0.svg)](https://github.com/YamanKoudmani/ha-washer-dryer-card/releases)

<p align="center">
  <img src="docs/screenshot.png" alt="Washer Dryer Card screenshot" width="600" />
</p>

> No screenshot yet? Drop your rendered card image at `docs/screenshot.png` and it will appear above.

---

## Features

- **Dual-machine support** — track a washer and a dryer in a single card, or hide either one
- **Cycle progress diagram** — SVG chevron strip that highlights the active phase (Wash → Rinse → Spin → Done / Dry → Cool → Done)
- **Estimated time remaining** — derived from a completion-time sensor, formatted as `45 min` or `1 hr 30 min`
- **Live power draw** — optional `W` / `kW` badge per machine
- **Running animation** — the machine icon gently rumbles while a cycle is active
- **Click-to-open** — tap (or keyboard `Enter`/`Space`) to open the more-info dialog
- **Visual editor** — every option is configurable from the Lovelace card editor
- **Sections view ready** — exposes `getGridOptions()` for the new dashboard layout
- **Phase aliases** — many smart appliances report variations like `ai_wash`, `weight_sensing`, `sanitizing`; the card normalizes them into the correct phase

---

## Installation

### HACS (recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed in Home Assistant.
2. Add this repository as a **Custom Repository** in HACS:
   - Go to **HACS → ⋮ → Custom repositories**
   - **Repository**: `https://github.com/YamanKoudmani/ha-washer-dryer-card`
   - **Category**: `Lovelace`
3. Search for **Washer Dryer Card** in HACS and install it.
4. Restart Home Assistant.
5. Add the resource (HACS should do this automatically):
   - **Settings → Dashboards → Resources → Add Resource**
   - **URL**: `/hacsfiles/ha-washer-dryer-card/washer-dryer-card.js`
   - **Type**: `JavaScript Module`

### Manual

1. Download `washer-dryer-card.js` from the latest release.
2. Copy it to `config/www/washer-dryer-card.js` in your Home Assistant configuration directory.
3. Add the resource:
   - **Settings → Dashboards → Resources → Add Resource**
   - **URL**: `/local/washer-dryer-card.js`
   - **Type**: `JavaScript Module`
4. Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).

---

## Configuration

### Quick start

```yaml
type: custom:washer-dryer-card
title: Laundry
washer:
  entity: sensor.washer_machine_state
  job_entity: sensor.washer_job_state
  completion_entity: sensor.washer_completion_time
  power_entity: sensor.washer_power
  name: Washing Machine
dryer:
  entity: sensor.dryer_machine_state
  job_entity: sensor.dryer_job_state
  completion_entity: sensor.dryer_completion_time
  power_entity: sensor.dryer_power
  name: Dryer
show_progress_bar: true
```

### Visual editor

The card registers a visual editor (find it under **Add card → By card → Washer Dryer Card**). Every field, including entity pickers for each of the four sensors per machine, is configurable from the UI.

---

## Configuration variables

### Card options

| Name               | Type      | Default     | Description                                                                 |
| ------------------ | --------- | ----------- | --------------------------------------------------------------------------- |
| `type`             | string    | **required** | Must be `custom:washer-dryer-card`                                          |
| `title`            | string    | *(none)*    | Optional title shown at the top of the card                                 |
| `washer`           | object    | *(none)*    | Washer machine configuration (see below)                                    |
| `dryer`            | object    | *(none)*    | Dryer machine configuration (see below). At least one of `washer`/`dryer` must be set |
| `show_progress_bar` | boolean  | `true`      | Show the SVG cycle phase diagram                                             |

### Machine options (`washer` / `dryer`)

| Name                | Type    | Default                    | Description                                                            |
| ------------------- | ------- | -------------------------- | ---------------------------------------------------------------------- |
| `entity`            | string  | *(none — required to display)* | The sensor reporting the machine state (`run`, `off`, `idle`, etc.) |
| `job_entity`        | string  | *(none)*                   | The sensor reporting the current cycle phase (e.g. `wash`, `dry`)      |
| `completion_entity` | string  | *(none)*                   | A `timestamp` / datetime sensor with the cycle end time                |
| `power_entity`      | string  | *(none)*                   | A `sensor` reporting live power draw in watts                          |
| `name`              | string  | `Washing Machine` / `Dryer` | Display name                                                         |
| `icon`              | string  | `mdi:washing-machine` / `mdi:tumble-dryer` | Material Design Icon                                  |
| `hidden`            | boolean | `false`                    | Hide this machine from the card                                       |

---

## How the sensors are used

| Sensor             | Expected state                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `entity`           | `run` to count as running; anything else shows the matching label (`Off`, `Idle`, `Standby`, `Paused`, `Delay`, `Complete`) |
| `job_entity`       | One of the [recognized phase values](#recognized-phase-values), or anything that maps to one          |
| `completion_entity` | An ISO 8601 datetime or a parseable timestamp                                                       |
| `power_entity`     | A numeric wattage; values ≥ 1000 W are shown in kW                                                  |

### Recognized phase values

The card groups the raw sensor values into display phases automatically.

**Washer**

| Display phase | Maps from                                                              |
| ------------- | ---------------------------------------------------------------------- |
| `Wash`        | `weight_sensing`, `pre_wash`, `ai_wash`, `wash`, `cooling`             |
| `Rinse`       | `ai_rinse`, `rinse`                                                     |
| `Spin`        | `ai_spin`, `spin`                                                       |
| `Done`        | `finish`                                                               |

**Dryer**

| Display phase | Maps from                                                              |
| ------------- | ---------------------------------------------------------------------- |
| `Dry`         | `weight_sensing`, `ai_drying`, `drying`, `sanitizing`                  |
| `Cool`        | `cooling`                                                              |
| `Done`        | `finished`, `wrinkle_prevent`, `air_wash`, `refreshing`                 |

If your appliance reports a phase value that isn't listed, the card will still display it as-is and skip the progress diagram highlight for that step.

---

## Examples

### Washer only

```yaml
type: custom:washer-dryer-card
washer:
  entity: sensor.washer_machine_state
  job_entity: sensor.washer_job_state
  completion_entity: sensor.washer_completion_time
  power_entity: sensor.washer_power
```

### Dryer only, with progress bar hidden

```yaml
type: custom:washer-dryer-card
washer:
  hidden: true
dryer:
  entity: sensor.dryer_machine_state
  job_entity: sensor.dryer_job_state
  completion_entity: sensor.dryer_completion_time
show_progress_bar: false
```

### Custom icons and names

```yaml
type: custom:washer-dryer-card
title: Laundry Room
washer:
  entity: sensor.washer_machine_state
  job_entity: sensor.washer_job_state
  icon: mdi:sofa
  name: Downstairs Washer
dryer:
  entity: sensor.dryer_machine_state
  job_entity: sensor.dryer_job_state
  icon: mdi:hanger
  name: Downstairs Dryer
```

### In a sections view

The card exposes `getGridOptions()`, so the sections layout will size it automatically. For a tight card, `columns: 6` works well.

```yaml
type: grid
columns: 6
square: false
cards:
  - type: custom:washer-dryer-card
    title: Laundry
    washer:
      entity: sensor.washer_machine_state
      job_entity: sensor.washer_job_state
    dryer:
      entity: sensor.dryer_machine_state
      job_entity: sensor.dryer_job_state
```

---

## Troubleshooting

**The card shows "No machines configured"**
You need at least one of `washer:` or `dryer:` with an `entity` defined. An empty `washer: {}` is a valid placeholder once you add the entity.

**The card is fully empty / no progress bar**
If only one machine is configured and its `entity` is unavailable, the card is hidden. Check **Developer Tools → States** for the entity and confirm it's not `unavailable` or `unknown`.

**Time remaining is missing**
`completion_entity` must be a real timestamp sensor. If your integration exposes a `timedelta` or relative duration, you may need a template sensor that converts it to an end-time `datetime`.

**The card is not in the picker**
Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`). If it's still missing, open the browser console — a `WASHER-DRYER-CARD v1.1.4` banner is logged on load. If you don't see it, the resource didn't load; double-check the URL and that the file is on disk.

**Phase values don't match**
The card's progress diagram only highlights a step when it recognizes the raw phase. Open an issue with the entity's possible states and we can add a mapping.

---

## Development

```bash
npm install
npm run build      # one-off production build into ./dist
npm start          # rollup watch mode
npm test           # vitest
```

The built file is `dist/washer-dryer-card.js` — `hacs.json` points at this path (`content_in_root: false`).
