try{

function LightLevel(value){
    ContextValue.call(this);
    this.lux = value;
    this.toString = function(){
        return "lux: " + this.lux;
    };
    this.matches = function(contextValue){

        if(contextValue){
            return contextValue.matchesLux(this);
        }
        else return false;
    };
    this.matchesLux = function(lux){

        return (Math.abs(this.lux - lux.lux)<7);
    };
}

function LightLevelSensor(){

    AbstractSensor.call(this);
    this.lastSensedValue;
    var me = this;

    this.handleLux = function(event) {
        //TODO: que se la guarde y reporte cada segundo y medio, para no abombar
        me.lastSensedValue = new LightLevel(event.value);
        me.notifyContextChange();
    };
    this.notifyContextChange = function(){

        var lux = this.lastSensedValue; //because it changes very fast
        for (var i = this.listeners.length - 1; i >= 0; i--) {
            //console.log("notifying lux: ", lux);
            this.listeners[i].onLightLevelChange(lux);
        }
    };
    this.start = function(){ 
        window.addEventListener("devicelight", this.handleLux, true);
    };
    this.stop = function(){ 

        window.removeEventListener("devicelight", this.handleLux, true);
        clearInterval(this.intervalId);
    };
};

}catch(err){console.log(err)}