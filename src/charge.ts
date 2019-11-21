/**
 * charge
 */

/**
 * Module Dependencies
 */
import Modbus from 'jsmodbus'
import Emitter from 'events'
import dgram from 'dgram'
import MQTT, { MqttClient } from 'mqtt'
import dns from 'dns'
import { globalLogger } from './services/logger'
import { IApplicationConfig, IUDPConfig } from './config'
import { Poller } from './polling'
import { initializeConfigServerHTTP, initializeConfigServerMQTT } from './server'
import { mqttTopicHandler, MQTTService } from './drivers/mqtt/mqtt'
import { UDPService } from './drivers/udp/udp'
import { eventBus } from './services/eventBus'

/**
 * Type Checking Helpers
 */

/**
 * Emitt `Application` Class.
 * Inherits from `Emitter.prototype`.
 */
export class Application extends Emitter {
  /**
   * Initialize new `Application`
   * @api public
   */
  env: string
  silent: boolean
  mqtt: MQTT.MqttClient | undefined = undefined
  udp: dgram.Socket | undefined = undefined
  udpConfig?: IUDPConfig
  options?: IApplicationConfig
  logger
  private initComplete: boolean

  /**
   * @param {object} [options] Application options
   * @param {string} [options.env='development'] Application Environment
   * @param {boolean} [options.silent=false] Application does not show logs
   */
  constructor(options?: IApplicationConfig) {
    super()
    this.options = options || this.defaultConfiguration()
    this.env = this.options.env || process.env.NODE_ENV || 'development'
    this.silent = this.options.silent || false
    this.logger = globalLogger
  }

  /**
   * Init method that initializes all driver and starts the main program
   * @api public
   */

  public start() {
    // Check if the application is online
    checkConnection(online => {
      if (!online && this.env !== 'development') {
        setInterval(() => {
          this.logger.log('warn', 'Device not connected to the internet.')
        }, 2000)
      } else if (!online && this.env === 'development') {
        this.logger.log('warn', 'Device not connected to the internet.')
      }
    })

    // TODO: Init all Porotocols
    // TODO: Init Protocols from Config
    this.initializeUDP(this.options.udpConfig)
    // TODO: MQTT Configuration
    this.initializeMQTT()

    // Initialize the config server
    // initializeConfigServerMQTT(this)
    initializeConfigServerHTTP(this, 3000)

    // Set the Init Done Flag
    this.emit('setup', true)
  }

  /**
   * Run all `start` methods to initialize the program
   * @emits `startDrivers`
   * @returns {void}
   * @api public
   */
  init() {
    eventBus.emit('startDrivers')
  }

  /**
   * Expose the `defaultConfiguration`
   */
  defaultConfiguration(): IApplicationConfig {
    return {
      env: 'development',
      silent: false,
      udpConfig: {
        port: 7090,
      },
    }
  }

  /**
   * UDP Initializer function
   * @api private
   */

  private initializeUDP(udpConfig: IUDPConfig): void {
    const { port } = udpConfig
    if (!this.udp) {
      this.udp = dgram.createSocket('udp4')

      this.udp.on('listening', () => {
        this.logger.info('UDP Socket listening on port ', port)
      })
      this.udp.on('message', (msg, rinfo) => {
        this.logger.info(`Message: ${rinfo.address}:${rinfo.port} - ${msg.toString()}`)
        // TODO: Message Handler
        this.emit('udpMessage', { msg: msg.toString(), rinfo })
      })
      this.udp.on('error', error => {
        this.logger.error(error)
      })
      this.udp.on('close', () => {
        this.logger.warn('UDP Socket closed!')
      })
      this.udp.bind(port)
    }
  }

  /**
   * Send a UDP Message and await the response.
   * The response object contains the `msg` as `string` and the `rinfo` sender information.
   * @returns {Promise<Object>} Object containing `msg` & `rinfo` properties.
   * @api public
   */
  requestUDP({ port, address, message }) {
    // TODO: Implement Call-Stack
    // Errors are handled in the global error handler
    this.udp.send(message, port, address)
  }

  /**
   * MQTT Client initialization
   * @api private
   */
  private initializeMQTT(mqttOptions?): void {
    if (!this.mqtt) {
      this.mqtt = MQTT.connect()
      // Test Client connection
      this.mqtt.subscribe('system', () => {
        this.mqtt.publish('system', 'connected')
        this.mqtt.on('message', (topic, msg) => {
          if (msg.toString() === 'connected') {
            this.logger.info('MQTT Client connected')
          }
          this.logger.info(`${topic}: ${msg.toString()}`)
          mqttTopicHandler(this, topic, msg.toString())
        })
      })
    }
  }
}

/**
 * ModbusTCP Client initialization
 * @api private
 */
// const modbusSocket = new net.Socket()
// const modbusClient = new Modbus.client.TCP(modbusSocket, 1234)

// modbusClient.readCoils(0, 10).then(resp => {
//   console.log(resp)
// }).catch(err => {
//   console.log(err)
// })

/**
 * Check for internet connection
 */
export function checkConnection(cb) {
  dns.lookup('google.com', error => {
    if (error && error.code == 'ENOTFOUND') {
      cb(false)
    } else {
      cb(true)
    }
  })
}

export { Poller, MQTTService, UDPService }
