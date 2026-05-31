import { ActionConfig, LovelaceCardConfig } from 'custom-card-helpers';

/** Configuration for a single machine (washer or dryer) */
export interface MachineConfig {
  /** Main machine state entity (e.g. sensor.washer_machine_state) */
  entity?: string;
  /** Job phase entity (e.g. sensor.washer_job_state) */
  job_entity?: string;
  /** Completion time entity (e.g. sensor.washer_completion_time) */
  completion_entity?: string;
  /** Power sensor entity (e.g. sensor.washer_power) */
  power_entity?: string;
  /** Display name (defaults to "Washing Machine" or "Dryer") */
  name?: string;
  /** MDI icon (defaults to mdi:washing-machine or mdi:tumble-dryer) */
  icon?: string;
  /** Hide this machine from the card */
  hidden?: boolean;
}

/** Main card configuration */
export interface WasherDryerCardConfig extends LovelaceCardConfig {
  type: string;
  /** Card title displayed at the top */
  title?: string;
  /** Washer machine configuration */
  washer?: MachineConfig;
  /** Dryer machine configuration */
  dryer?: MachineConfig;
  /** Show the job phase progress bar */
  show_progress_bar?: boolean;
  /** Tap action */
  tap_action?: ActionConfig;
  /** Hold action */
  hold_action?: ActionConfig;
}

/** Resolved state info for a machine */
export interface MachineStateInfo {
  /** Raw machine state (run, off, idle, etc.) */
  state: string;
  /** Human-readable state label */
  stateLabel: string;
  /** Whether the machine is actively running a cycle */
  isRunning: boolean;
  /** Whether the machine state is unavailable/unknown */
  unavailable: boolean;
  /** Current job phase (wash, rinse, spin, dry, cool, finish, etc.) */
  jobPhase: string;
  /** Formatted remaining time string (e.g. "45 min") */
  remainingTime: string;
  /** Whether to show the remaining time */
  showRemainingTime: boolean;
  /** Power consumption reading (if power entity configured) */
  power: string | null;
  /** Current step index for the progress bar */
  stepIndex: number;
  /** Total steps for the progress bar */
  totalSteps: number;
  /** Step labels for the progress bar */
  stepLabels: string[];
}

/** Washer job phase identifiers (mapped from raw sensor values) */
export type WasherPhase = 'wash' | 'rinse' | 'spin' | 'finish';

/** Dryer job phase identifiers */
export type DryerPhase = 'dry' | 'cool' | 'finished';
