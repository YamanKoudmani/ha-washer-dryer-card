import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { fireEvent } from 'custom-card-helpers';
import type { WasherDryerCardConfig, MachineConfig, MachineStateInfo } from './types';
import { CARD_VERSION } from './const';
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

        ${this._config?.show_progress_bar !== false && info.stepIndex >= 0
          ? html`
              <div class="step-indicator">
                ${info.stepLabels.map(
                  (label, i) => html`
                    <div class="step-segment">
                      ${i > 0 ? html`<div class="step-connector"></div>` : nothing}
                      <div
                        class="step ${classMap({
                          'step-active': i === info.stepIndex,
                          'step-past': i < info.stepIndex,
                          'step-future': i > info.stepIndex,
                        })}"
                      >
                        <span class="step-label">${label}</span>
                      </div>
                    </div>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
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

      /* ─── Step Indicator ─── */

      .step-indicator {
        display: flex;
        align-items: center;
        width: 100%;
      }

      .step-segment {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
      }

      .step-connector {
        flex-shrink: 0;
        width: 8px;
        height: 3px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 1px;
        margin-right: -1px;
      }

      .step {
        flex: 1;
        padding: 6px 4px;
        border-radius: 8px;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.2;
        transition: background 0.3s ease, color 0.3s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .step-past {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
        color: var(--primary-color);
      }

      .step-active {
        background: var(--primary-color);
        color: var(--text-primary-color, white);
      }

      .step-future {
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
        color: var(--disabled-text-color);
      }

      /* Connect steps: the connector after a past/active step gets the theme color */
      .step-past + .step-connector,
      .step-active + .step-connector {
        background: var(--primary-color);
        opacity: 0.5;
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
