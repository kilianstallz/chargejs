# chargejs
Utility libary for creating E-Mobile charging systems.

## Introduction

ChargeJs is a basic utility libary for creating e-mobile charging systems fast and simple.

## Quickstart

Requirements:

- NodeJs Version >= v8
- Redis-Server on local machine

### Install

```bash
npm install chargejs --save
```

### Example

Here is a simple application which is using an Express server to poll data from a UDP-Wallbox and then submitting it via MQTT-Protocol.

```javascript
import { Application, Poller, MQTTService, UDPService } from "chargejs";
import express from "express";

// Initialize Express App
const app = express();

// Initialize all services
const charge = new Application();
const udp = new UDPService();
const mqtt = new MQTTService();
const main = new Poller(5000);

charge.init(); // Start all listeners and servers.

// Setup udp handler for incoming messages/responses
udp.on('udpMessage', ({msg, rinfo}) => {
  mqtt.service.publish('/energy/1', JSON.stringify())
})

main.cyclic(() => {
	// Execute some code/do polling or requests
  udp.requestUDP({
    port: 7090,
    address: 'XXX.XXX.XXX',
    message: 'report 1'
  }) // Get a report from a wallbox device
})
main.poll()

app.listen(3000)
```

