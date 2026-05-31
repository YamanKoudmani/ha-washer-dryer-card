import { describe, it, expect } from 'vitest';
import {
  formatRemainingTime,
  formatStateLabel,
  formatPower,
  getEntityState,
  getEntityAttribute,
  resolveMachineState,
} from '../utils';
import {
  WASHER_PHASE_MAP,
  WASHER_PHASES,
  DRYER_PHASE_MAP,
  DRYER_PHASES,
  PHASE_LABELS,
  STATE_LABELS,
  DEFAULT_WASHER_NAME,
  DEFAULT_DRYER_NAME,
  DEFAULT_WASHER_ICON,
  DEFAULT_DRYER_ICON,
} from '../const';

// ─── formatRemainingTime ──────────────────────────────────────────────

describe('formatRemainingTime', () => {
  it('returns null for undefined', () => {
    expect(formatRemainingTime(undefined)).toBeNull();
  });

  it('returns null for "unavailable"', () => {
    expect(formatRemainingTime('unavailable')).toBeNull();
  });

  it('returns null for "unknown"', () => {
    expect(formatRemainingTime('unknown')).toBeNull();
  });

  it('returns null for past time', () => {
    const past = new Date(Date.now() - 60000).toISOString();
    expect(formatRemainingTime(past)).toBeNull();
  });

  it('formats minutes only', () => {
    const future = new Date(Date.now() + 30 * 60000).toISOString();
    const result = formatRemainingTime(future);
    expect(result).toMatch(/\d+ min/);
  });

  it('formats hours and minutes', () => {
    const future = new Date(Date.now() + 90 * 60000).toISOString();
    const result = formatRemainingTime(future);
    expect(result).toMatch(/1 hr 30 min/);
  });

  it('formats hours only for exact hours', () => {
    const future = new Date(Date.now() + 120 * 60000).toISOString();
    const result = formatRemainingTime(future);
    expect(result).toMatch(/2 hr/);
    expect(result).not.toContain('0 min');
  });

  it('returns "< 1 min" for very near future', () => {
    const future = new Date(Date.now() + 30 * 1000).toISOString();
    expect(formatRemainingTime(future)).toBe('< 1 min');
  });
});

// ─── formatStateLabel ─────────────────────────────────────────────────

describe('formatStateLabel', () => {
  it('returns "unavailable" as-is', () => {
    expect(formatStateLabel('unavailable')).toBe('unavailable');
  });

  it('returns "unknown" as-is', () => {
    expect(formatStateLabel('unknown')).toBe('unknown');
  });

  it('returns "Running" for "run"', () => {
    expect(formatStateLabel('run')).toBe('Running');
  });

  it('returns "Off" for "off"', () => {
    expect(formatStateLabel('off')).toBe('Off');
  });

  it('capitalizes unknown states', () => {
    expect(formatStateLabel('delay_wash')).toBe('Delay wash');
  });

  it('handles empty string', () => {
    expect(formatStateLabel('')).toBe('');
  });
});

// ─── formatPower ──────────────────────────────────────────────────────

describe('formatPower', () => {
  it('returns null for unavailable', () => {
    expect(formatPower('unavailable')).toBeNull();
  });

  it('returns null for unknown', () => {
    expect(formatPower('unknown')).toBeNull();
  });

  it('returns null for null', () => {
    expect(formatPower(null)).toBeNull();
  });

  it('formats watts', () => {
    expect(formatPower('500')).toBe('500 W');
  });

  it('formats kilowatts', () => {
    expect(formatPower('1500')).toBe('1.5 kW');
  });

  it('formats 0 watts', () => {
    expect(formatPower('0')).toBe('0 W');
  });

  it('passes through non-numeric values', () => {
    expect(formatPower('unknown_value')).toBe('unknown_value');
  });
});

// ─── getEntityState (mock state object) ────────────────────────────────

describe('getEntityState', () => {
  const mockHass = {
    states: {
      'sensor.test': { state: 'running' },
      'sensor.unavail': { state: 'unavailable' },
    } as Record<string, { state: string }>,
  } as any;

  it('returns state for existing entity', () => {
    expect(getEntityState(mockHass, 'sensor.test')).toBe('running');
  });

  it('returns "unavailable" for missing entity', () => {
    expect(getEntityState(mockHass, 'sensor.missing')).toBe('unavailable');
  });

  it('returns "unavailable" for undefined hass', () => {
    expect(getEntityState(undefined, 'sensor.test')).toBe('unavailable');
  });

  it('returns "unavailable" for undefined entityId', () => {
    expect(getEntityState(mockHass, undefined)).toBe('unavailable');
  });
});

// ─── getEntityAttribute ────────────────────────────────────────────────

describe('getEntityAttribute', () => {
  const mockHass = {
    states: {
      'sensor.test': {
        state: 'running',
        attributes: { unit_of_measurement: 'W' },
      },
    } as Record<string, { state: string; attributes?: Record<string, unknown> }>,
  } as any;

  it('returns attribute value', () => {
    expect(getEntityAttribute(mockHass, 'sensor.test', 'unit_of_measurement')).toBe('W');
  });

  it('returns null for missing entity', () => {
    expect(getEntityAttribute(mockHass, 'sensor.missing', 'unit_of_measurement')).toBeNull();
  });

  it('returns null for undefined hass', () => {
    expect(getEntityAttribute(undefined, 'sensor.test', 'unit_of_measurement')).toBeNull();
  });
});

// ─── resolveMachineState (integration-style) ──────────────────────────

describe('resolveMachineState', () => {
  const mockHass = {
    states: {
      'sensor.washer_machine_state': { state: 'run' },
      'sensor.washer_job_state': { state: 'ai_rinse' },
      'sensor.washer_completion_time': {
        state: new Date(Date.now() + 45 * 60000).toISOString(),
      },
      'sensor.washer_power': { state: '1200' },
      'sensor.dryer_machine_state': { state: 'off' },
      'sensor.dryer_job_state': { state: 'unknown' },
      'sensor.dryer_completion_time': { state: 'unavailable' },
      'sensor.dryer_power': { state: '0' },
    } as Record<string, { state: string }>,
  } as any;

  const washerConfig = {
    entity: 'sensor.washer_machine_state',
    job_entity: 'sensor.washer_job_state',
    completion_entity: 'sensor.washer_completion_time',
    power_entity: 'sensor.washer_power',
  };

  const dryerConfig = {
    entity: 'sensor.dryer_machine_state',
    job_entity: 'sensor.dryer_job_state',
    completion_entity: 'sensor.dryer_completion_time',
    power_entity: 'sensor.dryer_power',
  };

  it('resolves washer running state', () => {
    const info = resolveMachineState(mockHass, washerConfig, true);
    expect(info.state).toBe('run');
    expect(info.isRunning).toBe(true);
    expect(info.jobPhase).toBe('rinse');
    expect(info.stepIndex).toBe(1);
    expect(info.stepLabels).toEqual(['Wash', 'Rinse', 'Spin', 'Done']);
    expect(info.showRemainingTime).toBe(true);
    expect(info.remainingTime).toContain('min');
    expect(info.power).toBe('1.2 kW');
  });

  it('resolves dryer off state', () => {
    const info = resolveMachineState(mockHass, dryerConfig, false);
    expect(info.state).toBe('off');
    expect(info.isRunning).toBe(false);
    expect(info.stateLabel).toBe('Off');
    expect(info.showRemainingTime).toBe(false);
    expect(info.stepIndex).toBe(-1);
    expect(info.stepLabels).toEqual(['Dry', 'Cool', 'Done']);
  });

  it('handles unavailable state gracefully', () => {
    const emptyHass = { states: {} } as any;
    const info = resolveMachineState(emptyHass, {}, true);
    expect(info.unavailable).toBe(true);
    expect(info.isRunning).toBe(false);
    expect(info.state).toBe('unavailable');
  });

  it('uses default config values', () => {
    // With no config at all (empty object), it should use default entities
    // but they won't exist in hass, so state should be unavailable
    const emptyHass = { states: {} } as any;
    const info = resolveMachineState(emptyHass, {}, true);
    expect(info.unavailable).toBe(true);

    // With custom config entity, it should resolve
    const customHass = {
      states: {
        'sensor.custom_machine': { state: 'idle' },
      } as Record<string, { state: string }>,
    } as any;

    const customInfo = resolveMachineState(
      customHass,
      { entity: 'sensor.custom_machine' },
      true,
    );
    expect(customInfo.state).toBe('idle');
    expect(customInfo.stateLabel).toBe('Idle');
  });
});

// ─── Constants and Mappings ──────────────────────────────────────────

describe('Constants', () => {
  it('WASHER_PHASES has correct order', () => {
    expect(WASHER_PHASES).toEqual(['wash', 'rinse', 'spin', 'finish']);
  });

  it('DRYER_PHASES has correct order', () => {
    expect(DRYER_PHASES).toEqual(['dry', 'cool', 'finished']);
  });

  it('WASHER_PHASE_MAP covers all expected raw values', () => {
    const rawWasherJobs = [
      'weight_sensing', 'pre_wash', 'ai_wash', 'wash', 'cooling',
      'ai_rinse', 'rinse',
      'ai_spin', 'spin',
      'finish',
    ];
    for (const job of rawWasherJobs) {
      expect(WASHER_PHASE_MAP).toHaveProperty(job);
    }
  });

  it('DRYER_PHASE_MAP covers all expected raw values', () => {
    const rawDryerJobs = [
      'weight_sensing', 'ai_drying', 'drying', 'sanitizing',
      'cooling',
      'finished', 'wrinkle_prevent', 'air_wash', 'refreshing',
    ];
    for (const job of rawDryerJobs) {
      expect(DRYER_PHASE_MAP).toHaveProperty(job);
    }
  });

  it('PHASE_LABELS covers all phase types', () => {
    const phases = [...WASHER_PHASES, ...DRYER_PHASES];
    const uniquePhases = [...new Set(phases)];
    for (const phase of uniquePhases) {
      expect(PHASE_LABELS).toHaveProperty(phase);
    }
  });

  it('STATE_LABELS has expected mappings', () => {
    expect(STATE_LABELS.run).toBe('Running');
    expect(STATE_LABELS.off).toBe('Off');
    expect(STATE_LABELS.complete).toBe('Complete');
  });

  it('has correct default names and icons', () => {
    expect(DEFAULT_WASHER_NAME).toBe('Washing Machine');
    expect(DEFAULT_DRYER_NAME).toBe('Dryer');
    expect(DEFAULT_WASHER_ICON).toBe('mdi:washing-machine');
    expect(DEFAULT_DRYER_ICON).toBe('mdi:tumble-dryer');
  });
});
