import type { WasherPhase, DryerPhase } from './types';

export const CARD_VERSION = '1.1.1';

/** Default machine names */
export const DEFAULT_WASHER_NAME = 'Washing Machine';
export const DEFAULT_DRYER_NAME = 'Dryer';

/** Default machine icons */
export const DEFAULT_WASHER_ICON = 'mdi:washing-machine';
export const DEFAULT_DRYER_ICON = 'mdi:tumble-dryer';

/** Default entity IDs if none configured */
export const DEFAULT_WASHER_ENTITY = 'sensor.washer_machine_state';
export const DEFAULT_WASHER_JOB_ENTITY = 'sensor.washer_job_state';
export const DEFAULT_WASHER_COMPLETION_ENTITY = 'sensor.washer_completion_time';
export const DEFAULT_WASHER_POWER_ENTITY = 'sensor.washer_power';

export const DEFAULT_DRYER_ENTITY = 'sensor.dryer_machine_state';
export const DEFAULT_DRYER_JOB_ENTITY = 'sensor.dryer_job_state';
export const DEFAULT_DRYER_COMPLETION_ENTITY = 'sensor.dryer_completion_time';
export const DEFAULT_DRYER_POWER_ENTITY = 'sensor.dryer_power';

/**
 * Washer job phase mapping: raw sensor values → display phase
 *
 * Raw values like 'weight_sensing', 'pre_wash', 'ai_wash', 'wash', 'cooling'
 * map to the 'wash' display phase.
 */
export const WASHER_PHASE_MAP: Record<string, WasherPhase> = {
  weight_sensing: 'wash',
  pre_wash: 'wash',
  ai_wash: 'wash',
  wash: 'wash',
  cooling: 'wash',
  ai_rinse: 'rinse',
  rinse: 'rinse',
  ai_spin: 'spin',
  spin: 'spin',
  finish: 'finish',
};

/** Ordered washer phases for the progress bar */
export const WASHER_PHASES: WasherPhase[] = ['wash', 'rinse', 'spin', 'finish'];

/**
 * Dryer job phase mapping: raw sensor values → display phase
 */
export const DRYER_PHASE_MAP: Record<string, DryerPhase> = {
  weight_sensing: 'dry',
  ai_drying: 'dry',
  drying: 'dry',
  sanitizing: 'dry',
  cooling: 'cool',
  finished: 'finished',
  wrinkle_prevent: 'finished',
  air_wash: 'finished',
  refreshing: 'finished',
};

/** Ordered dryer phases for the progress bar */
export const DRYER_PHASES: DryerPhase[] = ['dry', 'cool', 'finished'];

/** Phase display labels */
export const PHASE_LABELS: Record<string, string> = {
  wash: 'Wash',
  rinse: 'Rinse',
  spin: 'Spin',
  finish: 'Done',
  dry: 'Dry',
  cool: 'Cool',
  finished: 'Done',
};

/** Phase icons */
export const PHASE_ICONS: Record<string, string> = {
  wash: 'mdi:waves',
  rinse: 'mdi:shower-head',
  spin: 'mdi:fan',
  finish: 'mdi:check-circle',
  dry: 'mdi:heat-wave',
  cool: 'mdi:snowflake',
  finished: 'mdi:check-circle',
};

/** Machine state → human-readable label */
export const STATE_LABELS: Record<string, string> = {
  run: 'Running',
  off: 'Off',
  idle: 'Idle',
  standby: 'Standby',
  pause: 'Paused',
  delay: 'Delay',
  complete: 'Complete',
  finish: 'Complete',
};
