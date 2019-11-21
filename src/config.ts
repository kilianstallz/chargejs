import { EventEmitter } from 'events'

export interface IApplicationConfig {
  env: string | undefined
  silent?: boolean
  udpConfig?: IUDPConfig
}

export interface IUDPConfig {
  port: number
}
