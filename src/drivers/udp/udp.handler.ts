/**
 * UDP Message Handler
 */

 /**
  * Import module dependencies
  */
import {RemoteInfo} from 'dgram'
import { eventBus } from '../../services/eventBus'
import { globalLogger } from '../../services/logger'
import { UDPService } from './udp'

/**
 * The handler function
 * @param msg The message string
 * @param rinfo Remote Info object
 */
const udpMessageHandler = (context: UDPService, msg: string, rinfo: RemoteInfo) => {
  if(msg.startsWith('{')) {
     const _parsedMsg = JSON.parse(msg)
     context.emit('udpMessage', {msg: _parsedMsg, rinfo})
  } else if (msg == 'TCH-OK :done') {
    return
  } else {
    context.emit('udpError', {msg, rinfo})
    globalLogger.info(msg, rinfo)
  }
}

/**
 * Export modules
 */
export {
  udpMessageHandler
}
