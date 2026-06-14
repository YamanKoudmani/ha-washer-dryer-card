import { LitElement, html, svg, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { fireEvent } from 'custom-card-helpers';
import type { WasherDryerCardConfig, MachineConfig, MachineStateInfo } from './types';
import {
  CARD_VERSION,
  WASHER_PHASES,
  DRYER_PHASES,
  PHASE_LABELS,
  PHASE_ICONS,
} from './const';
import { resolveMachineState } from './utils';
import './editor';

@customElement('washer-dryer-card')
export class WasherDryerCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WasherDryerCardConfig;

  static getConfigElement(): HTMLElement {
    return document.createElement('washer-dryer-card-editor');
  }

  static getStubConfig(): Record<string, unknown> {
    return {
      type: 'custom:washer-dryer-card',
      title: 'Laundry',
      washer: {},
      dryer: {},
      show_progress_bar: true,
    };
  }

  getCardSize(): number {
    let count = 0;
    if (this._config?.washer && !this._config.washer.hidden) count++;
    if (this._config?.dryer && !this._config.dryer.hidden) count++;
    if (this._config?.title) count++;
    return Math.max(1, count * 2);
  }

  /** Sections view grid options for the new dashboard layout */
  getGridOptions(): Record<string, number> {
    let count = 0;
    if (this._config?.washer && !this._config.washer.hidden) count++;
    if (this._config?.dryer && !this._config.dryer.hidden) count++;
    const rows = Math.max(1, count * 2);
    return { rows, min_rows: 1, max_rows: 4, columns: 6, min_columns: 1, max_columns: 12 };
  }

  public setConfig(config: WasherDryerCardConfig): void {
    if (!config.washer && !config.dryer) {
      throw new Error('At least one machine (washer or dryer) must be configured');
    }

    this._config = {
      ...config,
      show_progress_bar: config.show_progress_bar ?? true,
    };
  }

  /** Guard rendering until config is ready */
  protected shouldUpdate(): boolean {
    return !!this._config;
  }

  /** Open more-info dialog for a machine entity */
  private _openMoreInfo(entityId: string | undefined): void {
    if (entityId) {
      fireEvent(this, 'hass-more-info', { entityId });
    }
  }

  /** Render a single machine panel */
  private _renderMachine(
    machineConfig: MachineConfig | undefined,
    isWasher: boolean,
  ): unknown {
    if (!machineConfig || machineConfig.hidden) return nothing;

    const info: MachineStateInfo = resolveMachineState(this.hass, machineConfig, isWasher);
    const entityId = machineConfig.entity;

    const phases = isWasher ? WASHER_PHASES : DRYER_PHASES;
    const steps = phases.map((phase, i) => ({
      label: info.stepLabels[i] || PHASE_LABELS[phase] || phase,
      icon: PHASE_ICONS[phase] || '',
    }));

    // Build the status label
    let statusText = info.stateLabel;
    if (info.showRemainingTime) {
      statusText = `Running • Finish in ${info.remainingTime}`;
    }

    // Icon animation when running
    const iconClasses = classMap({
      'machine-icon': true,
      rumble: info.isRunning,
    });

    return html`
      <div
        class="machine-panel ${classMap({ unavailable: info.unavailable })}"
        @click=${() => this._openMoreInfo(entityId)}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._openMoreInfo(entityId);
          }
        }}
        role="button"
        tabindex="0"
        aria-label=${`${machineConfig.name || ''} — ${statusText}`}
      >
        <div class="machine-header">
          <div class="icon-cell">
            <ha-icon class=${iconClasses} icon=${machineConfig.icon || ''}></ha-icon>
          </div>
          <div class="machine-info">
            <div class="machine-name">${machineConfig.name || ''}</div>
            <div class="machine-status">${statusText}</div>
          </div>
          ${info.power
            ? html`<div class="power-badge">${info.power}</div>`
            : nothing}
        </div>

        ${this._config?.show_progress_bar !== false && (info.stepIndex >= 0 || info.isRunning)
          ? this._renderPhaseDiagram(steps, info.stepIndex, isWasher)
          : nothing}
      </div>
    `;
  }

  /** Render SVG chevron phase diagram */
  private _renderPhaseDiagram(
    steps: Array<{ label: string; icon: string }>,
    stepIndex: number,
    isWasher: boolean,
  ) {
    const washerPaths = [
      { d: 'M2,2 L85,2 L100,25 L85,48 L2,48 Z', cx: 51, tx: 0 },
      { d: 'M2,2 L85,2 L100,25 L85,48 L2,48 L17,25 Z', cx: 134, tx: 83 },
      { d: 'M2,2 L85,2 L100,25 L85,48 L2,48 L17,25 Z', cx: 217, tx: 166 },
      { d: 'M2,2 L100,2 L100,48 L2,48 L17,25 Z', cx: 300, tx: 249 },
    ];

    const dryerPaths = [
      { d: 'M2,2 L115,2 L130,25 L115,48 L2,48 Z', cx: 66, tx: 0 },
      { d: 'M2,2 L115,2 L130,25 L115,48 L2,48 L17,25 Z', cx: 179, tx: 113 },
      { d: 'M2,2 L125,2 L125,48 L2,48 L17,25 Z', cx: 289.5, tx: 226 },
    ];

    const pathData = isWasher ? washerPaths : dryerPaths;

    return svg`
      <svg
        viewBox="0 0 355 50"
        preserveAspectRatio="xMidYMid meet"
        style="width: 100%; height: auto; display: block; margin-top: 4px;"
      >
        ${steps.map((step, i) => {
          const isActive = i === stepIndex;
          const pathColor = isActive
            ? 'var(--primary-color)'
            : 'rgba(var(--rgb-primary-color, 3, 169, 244), 0.15)';
          const textColor = isActive
            ? 'var(--text-primary-color, white)'
            : 'var(--primary-color)';
          const { d, cx, tx } = pathData[i];
          return svg`
            <g>
              <path
                d="${d}"
                transform="translate(${tx}, 0)"
                fill="${pathColor}"
                stroke="var(--divider-color)"
                stroke-width="1"
              />
              <foreignObject
                x="${cx - 10}"
                y="4"
                width="20"
                height="20"
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style="display: flex; align-items: center; justify-content: center; height: 100%;"
                >
                  <ha-icon
                    icon="${step.icon}"
                    style="--mdc-icon-size: 16px; color: ${textColor};"
                  ></ha-icon>
                </div>
              </foreignObject>
              <text
                x="${cx}"
                y="38"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="${textColor}"
                font-family="sans-serif"
                font-size="13px"
                font-weight="bold"
              >
                ${step.label}
              </text>
            </g>
          `;
        })}
      </svg>
    `;
  }

  protected render(): unknown {
    if (!this._config) return nothing;

    const config = this._config;
    const hasWasher = config.washer && !config.washer.hidden;
    const hasDryer = config.dryer && !config.dryer.hidden;

    if (!hasWasher && !hasDryer) {
      return html`
        <ha-card>
          <div class="empty-state">
            <ha-icon icon="mdi:washing-machine"></ha-icon>
            <p>No machines configured</p>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        ${config.title
          ? html`<div class="card-header">${config.title}</div>`
          : nothing}

        <div class="machines">
          ${this._renderMachine(config.washer, true)}
          ${this._renderMachine(config.dryer, false)}
        </div>
      </ha-card>
    `;
  }

  static get styles(): ReturnType<typeof css> {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 20px;
        box-sizing: border-box;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      .card-header {
        font-family: var(--paper-font-headline_-_font-family, inherit);
        font-size: 22px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin: 0 0 16px 0;
        padding: 0;
        line-height: 1.2;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 16px;
        color: var(--secondary-text-color);
        gap: 12px;
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--disabled-text-color);
      }

      .empty-state p {
        margin: 0;
        font-size: 14px;
        text-align: center;
      }

      .machines {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* ─── Machine Panel ─── */

      .machine-panel {
        background: var(
          --ha-card-background,
          var(--card-background-color, var(--secondary-background-color, #f5f5f5))
        );
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
        border-radius: var(--ha-card-border-radius, 12px);
        padding: 16px;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        gap: 14px;
        outline: none;
      }

      .machine-panel:focus-visible {
        box-shadow: 0 0 0 2px var(--primary-color);
      }

      .machine-panel:hover {
        box-shadow: var(
          --ha-card-box-shadow,
          0 2px 8px rgba(0, 0, 0, 0.08)
        );
      }

      .machine-panel.unavailable {
        opacity: 0.55;
      }

      /* ─── Header Row ─── */

      .machine-header {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .icon-cell {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.08));
        border: 2px solid var(--divider-color, rgba(0, 0, 0, 0.1));
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .machine-icon {
        --mdc-icon-size: 24px;
        color: var(--primary-text-color);
      }

      .machine-icon.rumble {
        color: var(--primary-color);
        animation: rumble 0.4s linear infinite;
      }

      @keyframes rumble {
        0% { transform: translate(0px, 0px) rotate(0deg); }
        25% { transform: translate(-1px, 1px) rotate(-1deg); }
        50% { transform: translate(0px, -1px) rotate(0deg); }
        75% { transform: translate(1px, 1px) rotate(1deg); }
        100% { transform: translate(0px, 0px) rotate(0deg); }
      }

      .machine-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .machine-name {
        font-size: 17px;
        font-weight: 600;
        color: var(--primary-text-color);
        line-height: 1.3;
      }

      .machine-status {
        font-size: 13px;
        color: var(--secondary-text-color);
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .power-badge {
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
        padding: 4px 10px;
        border-radius: 12px;
        white-space: nowrap;
      }

      /* ─── Phase Diagram ─── */

      svg {
        margin-top: 4px;
        display: block;
      }
    `;
  }
}

/* ---------- HA custom cards registry ---------- */
declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'washer-dryer-card',
  name: 'Washer Dryer Card',
  description: 'Monitor washer and dryer status with cycle progress tracking',
  preview: true,
});

/* ---------- version banner ---------- */
console.info(
  `%c WASHER-DRYER-CARD %c v${CARD_VERSION} `,
  'color: white; background: #1565c0; font-weight: bold;',
  'color: #1565c0; background: white; font-weight: bold;',
);
