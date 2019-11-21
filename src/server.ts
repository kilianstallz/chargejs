/**
 * Config Server
 */

/**
 * Module Imports
 */
import express, { Router } from 'express'
import { Application } from './charge'
import helmet from 'helmet'
const ConfigController = require('./configServer/rest/controllers')

/**
 * Initialize the REST Config Server
 * @param context The Root Application Class Context
 * @param port The Port to listen on
 */
export function initializeConfigServerHTTP(context: Application, port: number = 3000) {
  const app = express()

  /**
   * Server Middleware
   */
  app.use(helmet())

  app.use('/config', ConfigController)

  app.get('/v', (req, res) => {
    return res.status(200).send('V.OK')
  })

  app.listen(port, () => {
    context.logger.info(`Config Server served on port ${port}`)
  })
}

/**
 * Initialize the MQTT Config Server
 */
export function initializeConfigServerMQTT(context: Application) {
  // if(!context.mqtt.connected) {
  //   return
  // }
  context.mqtt.subscribe('config', (err, granted) => {
    if(err) {
      context.logger.error(err)
    }
  })
  context.mqtt.subscribe('config/chargers', (err, granted) => {
    if(err) {
      context.logger.error(err)
    }
  })
}
