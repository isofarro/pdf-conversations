export enum StatusEnum {
  INIT = 'init',
  UPLOADING = 'uploading',
  WAITING = 'waiting',
  IDLE = 'idle',
  ERROR = 'error',
}

export type StatusEnumStrings = keyof typeof StatusEnum;
