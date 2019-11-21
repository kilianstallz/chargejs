// ===========================================
// Poller
// ===========================================
import { EventEmitter } from 'events'

export class Poller extends EventEmitter {
  timeout
  constructor(timeout = 2000) {
    super()
    this.timeout = timeout
  }

  poll() {
    setTimeout(() => this.emit('poll'), this.timeout)
  }

  cyclic(cb) {
    this.on('poll', cb)
  }
}
