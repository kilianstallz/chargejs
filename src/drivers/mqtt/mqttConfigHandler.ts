/**
 * MQTT Config Handler
 * Handle Messages revieced on the `config` topic
 * Application & Device Configuration
 */

export function mqttConfigHandler(topic, msg: string) {
  switch(topic) {
    case 'config/chargers':
      console.log('Config set')
      break;
  }
}

const configExample = {
  "chargers": { // Charger Map
    "18871884": { // Key is the unique id (serial) number of the charger
      "uid": '18871884', // Unique ID (serial)
      "name": "Wallbox 1", // Custom name of the wallbox
      "IP_address": "192.168.0.102", // Wallbox ip address
      "port": 7090, // Wallbox port
      "protocol": "udp4", // Protocol to be used
    }
  }
}
