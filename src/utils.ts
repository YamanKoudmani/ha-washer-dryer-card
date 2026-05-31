import type { HomeAssistant } from 'custom-card-helpers';
import type {
  MachineConfig,
  MachineStateInfo,
} from './types';
import {
  WASHER_PHASE_MAP,
  WASHER_PHASES,
  DRYER_PHASE_MAP,
  DRYER_PHASES,
  PHASE_LABELS,
  STATE_LABELS,
} from './const';

/**
 * Get a string state from HA for a given entity, returning 'unavailable'
 * if the entity doesn't exist.
 */
export function getEntityState(hass: HomeAssistant | undefined, entityId: string | undefined): string {
  if (!hass || !entityId) return 'unavailable';
  const stateObj = hass.states[entityId];
  if (!stateObj) return 'unavailable';
  return stateObj.state;
}

/**
 * Get a numeric attribute from an entity state.
 */
export function getEntityAttribute(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  attribute: string,
): string | null {
  if (!hass || !entityId) return null;
  const stateObj = hass.states[entityId];
  if (!stateObj || !stateObj.attributes) return null;
  const value = (stateObj.attributes as Record<string, unknown>)[attribute];
  return value !== undefined && value !== null ? String(value) : null;
}

/**
 * Format remaining time from an ISO end-time string.
 * Returns a human-friendly duration like "45 min" or "1 hr 30 min".
 */
export function formatRemainingTime(endTimeStr: string | undefined): string | null {
  if (!endTimeStr || endTimeStr === 'unavailable' || endTimeStr === 'unknown') {
    return null;
  }

  const end = new Date(endTimeStr);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return null;

  const diffMins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
  if (hrs > 0) return `${hrs} hr`;
  if (mins > 0) return `${mins} min`;
  return '< 1 min';
}

/**
 * Format a state string for display (capitalize, replace underscores).
 */
export function formatStateLabel(state: string): string {
  if (!state || state === 'unavailable' || state === 'unknown') return state;
  return STATE_LABELS[state] || state.charAt(0).toUpperCase() + state.slice(1).replace(/_/g, ' ');
}

/**
 * Format power value for display.
 */
export function formatPower(power: string | null): string | null {
  if (!power || power === 'unavailable' || power === 'unknown') return null;
  const num = parseFloat(power);
  if (isNaN(num)) return power;
  if (num >= 1000) return `${(num / 1000).toFixed(1)} kW`;
  return `${Math.round(num)} W`;
}

/**
 * Determine the active phase index and total steps for a machine.
 */
export function resolveMachineState(
  hass: HomeAssistant | undefined,
  config: MachineConfig | undefined,
  isWasher: boolean,
): MachineStateInfo {
  const phaseMap = isWasher ? WASHER_PHASE_MAP : DRYER_PHASE_MAP;
  const phases = isWasher ? WASHER_PHASES : DRYER_PHASES;

  const machineState = getEntityState(hass, config?.entity);
  const jobState = getEntityState(hass, config?.job_entity);
  const completionTime = getEntityState(hass, config?.completion_entity);
  const powerRaw = getEntityState(hass, config?.power_entity);

  const unavailable = machineState === 'unavailable' || machineState === 'unknown';
  const isRunning = machineState === 'run';
  const stateLabel = formatStateLabel(machineState);

  // Resolve job phase
  const mappedPhase = phaseMap[jobState];
  const jobPhase = mappedPhase ?? jobState;
  const stepLabels = phases.map((p) => PHASE_LABELS[p] || p);
  const stepIndex = mappedPhase !== undefined ? (phases as readonly string[]).indexOf(mappedPhase) : -1;
  const totalSteps = phases.length;

  // Remaining time
  const remainingTime = formatRemainingTime(completionTime);
  const showRemainingTime = isRunning && remainingTime !== null;

  // Power
  const power = formatPower(powerRaw);

  return {
    state: machineState,
    stateLabel,
    isRunning,
    unavailable,
    jobPhase,
    remainingTime: remainingTime ?? '',
    showRemainingTime,
    power,
    stepIndex,
    totalSteps,
    stepLabels,
  };
}
