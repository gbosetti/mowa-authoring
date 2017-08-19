function ContextValue(){
    this.toString = function(){};
    this.matches = function(){};
    this.equals = function(contextValue){
        return this.matches(contextValue);
    };
    this.matchesOrientation = function(){ return false; };
    this.matchesLux = function(){ return false; };
}

function AbstractSensor(){
    this.state = new NotSensing(this); //TODO: use state pattern
    this.listeners = [];

    this.setState = function(state) {

        this.state = state;
    };
    this.addListener = function(listener) {

        this.listeners.push(listener);
    };
    this.hasListeners = function() {

        return (this.listeners.length>0);
    };
    this.removeListener = function(listener) {
        
        var index = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
    };
    this.startSensing = function(){
        this.state.startSensing();
    }
    this.stopSensing = function(){
        this.state.stopSensing();
    }
}

function SensorState(sensor){
    this.sensor = sensor;
    this.startSensing = function(){}
    this.stopSensing = function(){}
}
function Sensing(sensor){
    SensorState.call(this, sensor);
    this.stopSensing = function(){
        
        if(!this.sensor.hasListeners()) {
            this.sensor.stop();
            this.sensor.setState(new NotSensing(this.sensor));
        }
    }
}
function NotSensing(sensor){
    SensorState.call(this, sensor);
    this.startSensing = function(){
        if(this.sensor.hasListeners()) {
            this.sensor.start();
            this.sensor.setState(new Sensing(this.sensor));
        }
    }
}