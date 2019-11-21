import dgram from 'dgram'
import { eventBus } from '../../services/eventBus'
import { globalLogger } from '../../services/logger'
import { udpMessageHandler } from './udp.handler'
import { EventEmitter } from 'events'

/**
 * Expose The MQTT Service Class
 * @param options Provide `MQTTConfig` to the Initializer
 * @listener startDrivers Listen to the global event to start the server process
 */
export class UDPService extends EventEmitter {
  service: dgram.Socket
  private port: number = 7090
  constructor(options?) {
    super()
    eventBus.on('startDrivers', () => {
      this.start()
    })
  }

  /**
   * Start the UDP Service
   * @returns {void}
   * @api public
   */

  start() {
    this.service = dgram.createSocket('udp4')
    this.service.on('listening', () => {
      globalLogger.info('UDP Socket listening on port ', this.port)
    })
    this.service.on('message', (msg, rinfo) => {
      globalLogger.info(`Message: ${rinfo.address}:${rinfo.port}`)
      // TODO: Message Handler
      udpMessageHandler(this, msg.toString(), rinfo)
    })
    this.service.on('error', error => {
      globalLogger.error(error)
    })
    this.service.on('close', () => {
      globalLogger.warn('UDP Socket closed!')
    })
    this.service.bind(this.port)
  }

  /**
   * Send a UDP Message and await the response.
   * The response object contains the `msg` as `string` and the `rinfo` sender information.
   * @returns {void} Object containing `msg` & `rinfo` properties.
   * @api public
   */
  requestUDP({ port, address, message }) {
    // TODO: Implement Call-Stack
    // Errors are handled in the global error handler
    this.service.send(message, port, address)
  }
}
