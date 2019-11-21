import { Application } from '../../charge'
import { mqttConfigHandler } from './mqttConfigHandler'
import MQTT from 'mqtt'
import { eventBus } from '../../services/eventBus'
import { globalLogger } from '../../services/logger'

/**
 * Handle MQTT Messages Recieved
 * @param context Application Context
 * @param topic
 * @param message
 */
export function mqttTopicHandler(context: Application, topic: string, message: string) {
  if (topic.startsWith('config')) {
    return mqttConfigHandler(topic, message)
  }
}

/**
 * Expose The MQTT Service Class
 * @param options Provide `MQTTConfig` to the Initializer
 * @listener startDrivers Listen to the global event to start the server process
 */
export class MQTTService {
  service: MQTT.MqttClient | undefined = undefined
  constructor(options?) {
    eventBus.on('startDrivers', () => {
      this.start()
    })
  }

  start() {
    this.service = MQTT.connect()
    this.service.subscribe('system', () => {
      this.service.publish('system', 'connected')
      this.service.on('message', (topic, msg) => {
        if (msg.toString() === 'connected') {
          globalLogger.info('MQTT Client connected')
        }
        globalLogger.info(`${topic}: ${msg.toString()}`)
      })
    })
  }
}
