import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';
import { fireEvent } from 'custom-card-helpers';
import type { WasherDryerCardConfig, MachineConfig } from './types';
import {
  DEFAULT_WASHER_NAME,
  DEFAULT_DRYER_NAME,
  DEFAULT_WASHER_ICON,
  DEFAULT_DRYER_ICON,
} from './const';

@customElement('washer-dryer-card-editor')
export class WasherDryerCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: WasherDryerCardConfig;

  public setConfig(config: WasherDryerCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const configValue = target.dataset.configValue;
    if (!configValue) return;

    let value: unknown = target.value;
    if (target.type === 'number') {
      value = value === '' ? undefined : Number(value);
      if (value !== undefined && isNaN(value as number)) return;
    }
    if (target.type === 'checkbox') {
      value = (target as HTMLInputElement).checked;
    }

    if (this._config && (this._config as Record<string, unknown>)[configValue] === value) return;

    this._config = { ...this._config!, [configValue]: value } as WasherDryerCardConfig;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _machineChanged(
    machine: 'washer' | 'dryer',
    field: string,
    ev: Event | CustomEvent,
  ): void {
    const current = this._config?.[machine] ?? {};
    let value: unknown;

    if (field === 'entity' || field === 'job_entity' || field === 'completion_entity' || field === 'power_entity') {
      value = (ev as CustomEvent).detail?.value;
    } else if (field === 'hidden') {
      value = (ev as Event).target ? ((ev as Event).target as HTMLInputElement).checked : false;
    } else {
      value = (ev as Event).target ? ((ev as Event).target as HTMLInputElement).value : '';
      if (value === '') value = undefined;
    }

    const updated: MachineConfig = { ...current, [field]: value };
    // Clean up undefined values
    for (const key of Object.keys(updated)) {
      if ((updated as Record<string, unknown>)[key] === undefined) {
        delete (updated as Record<string, unknown>)[key];
      }
    }

    this._config = { ...this._config!, [machine]: Object.keys(updated).length > 0 ? updated : undefined };
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private _renderMachineSection(
    machine: 'washer' | 'dryer',
    label: string,
    defaultIcon: string,
    defaultName: string,
  ): unknown {
    if (!this.hass) return nothing;

    const config = this._config ?? ({} as WasherDryerCardConfig);
    const machineConfig = config[machine] ?? {};

    return html`
      <div class="section">
        <div class="section-title">${label}</div>

        <label class="toggle">
          <input
            type="checkbox"
            .checked=${machineConfig.hidden ?? false}
            @change=${(ev: Event) => this._machineChanged(machine, 'hidden', ev)}
          />
          <span>Hidden</span>
        </label>

        <div class="field">
          <label>Machine State Entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${machineConfig.entity ?? ''}
            allow-custom-entity
            @value-changed=${(ev: CustomEvent) => this._machineChanged(machine, 'entity', ev)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Job Phase Entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${machineConfig.job_entity ?? ''}
            allow-custom-entity
            @value-changed=${(ev: CustomEvent) => this._machineChanged(machine, 'job_entity', ev)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Completion Time Entity</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${machineConfig.completion_entity ?? ''}
            allow-custom-entity
            @value-changed=${(ev: CustomEvent) => this._machineChanged(machine, 'completion_entity', ev)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Power Sensor Entity (optional)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${machineConfig.power_entity ?? ''}
            allow-custom-entity
            @value-changed=${(ev: CustomEvent) => this._machineChanged(machine, 'power_entity', ev)}
          ></ha-entity-picker>
        </div>

        <div class="field">
          <label>Display Name (optional)</label>
          <input
            type="text"
            class="ha-input"
            placeholder=${defaultName}
            .value=${machineConfig.name ?? ''}
            @input=${(ev: Event) => this._machineChanged(machine, 'name', ev)}
          />
        </div>

        <div class="field">
          <label>Icon (optional)</label>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${machineConfig.icon ?? ''}
            .placeholder=${defaultIcon}
            @value-changed=${(ev: CustomEvent) => this._machineChanged(machine, 'icon', ev)}
          ></ha-icon-picker>
        </div>
      </div>
    `;
  }

  protected render(): unknown {
    if (!this.hass) {
      return html`<div class="loading">Loading…</div>`;
    }

    const config = this._config ?? ({} as WasherDryerCardConfig);

    return html`
      <div class="editor">
        <!-- Title -->
        <div class="section">
          <div class="section-title">Card</div>
          <div class="field">
            <label>Title</label>
            <input
              type="text"
              class="ha-input"
              placeholder="Laundry"
              .value=${config.title ?? ''}
              data-config-value="title"
              @input=${this._valueChanged}
            />
          </div>

          <label class="toggle">
            <input
              type="checkbox"
              .checked=${config.show_progress_bar !== false}
              data-config-value="show_progress_bar"
              @change=${this._valueChanged}
            />
            <span>Show cycle progress bar</span>
          </label>
        </div>

        ${this._renderMachineSection('washer', 'Washer', DEFAULT_WASHER_ICON, DEFAULT_WASHER_NAME)}
        ${this._renderMachineSection('dryer', 'Dryer', DEFAULT_DRYER_ICON, DEFAULT_DRYER_NAME)}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 8px 0;
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin: 0 0 2px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .field label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .ha-input {
        width: 100%;
        padding: 8px 12px;
        font-size: 14px;
        font-family: var(--paper-font-body_-_font-family, inherit);
        color: var(--primary-text-color);
        background: var(--secondary-background-color, #f5f5f5);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.15));
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }

      .ha-input:focus {
        border-color: var(--primary-color);
      }

      .ha-input::placeholder {
        color: var(--disabled-text-color, #9e9e9e);
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .toggle input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
      }

      ha-entity-picker,
      ha-icon-picker {
        width: 100%;
      }
    `;
  }
}
