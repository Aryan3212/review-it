/* 🚧 Work in Progress 🚧 */
const EventEmitter = require("events");

type ModuleObject = {
    initialize: Function
}

class ModulesManager extends EventEmitter {
    constructor(app: Object) {
        super();
        this.app = app;
    }
    
    inject(module: ModuleObject) {
      	module.initialize();
        this.app.use(module);
    }
}