export class Action {
  name: string
  handler: () => void

  constructor(name: string, handler: () => void) {
    this.name = name
    this.handler = handler
  }
}

