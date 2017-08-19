try{

function DeviceOrientation(alpha, beta, gamma){
    ContextValue.call(this);
    this.alpha = alpha;
    this.beta = beta;
    this.gamma = gamma;
    this.toString = function(contextValue){

        return "a:" + this.alpha + " b:" + this.beta + " g:" + this.gamma;
    };
    this.matches = function(contextValue){

        if(contextValue){
            
            return contextValue.matchesOrientation(this);
        }
        else return false;
    };
    this.matchesOrientation = function(location){

        return (this.matchesBeta(location.beta)); //  && this.matchesBeta(location.beta) && this.matchesGamma(location.gamma));
    };
    this.matchesAlpha = function(alpha){
        //autour de l'axe « z », en degrés sur une échelle de 0° à 360°
        //console.log("ALPHA DIF: ", Math.abs(this.alpha - alpha));
        return (Math.abs(this.alpha - alpha)<25); //25 is almost the 7% of 360 
    };
    this.matchesBeta = function(beta){
        //autour de l'axe « y » en degrés, sur une échelle de -180° à 180°
        //console.log("BETA DIF: ", Math.abs(this.beta - beta));
        return (Math.abs(this.beta - beta)<25);
    };
    this.matchesGamma = function(gamma){
        //console.log("GAMMA DIF: ", Math.abs(this.gamma - gamma));
        //autour de l'axe « x », exprimée en degrés sur une échelle de -90° à 90°
        return (Math.abs(this.gamma - gamma)<12);
    };
}

function DeviceOrientationSensor(){

    AbstractSensor.call(this);

    this.lastSensedOrientation;
    //this.lastNotifiedOrientation;
    this.intervalId;
    var me = this;

    this.handleOrientation = function(event) {
        //TODO: que se la guarde y reporte cada segundo y medio, para no abombar
        me.lastSensedOrientation = new DeviceOrientation(event.alpha, event.beta, event.gamma);
    };
    this.notifyContextChange = function(){

        var sameOrientation = this.lastSensedOrientation; //because it changes very fast
        //if(lastSensedOrientation.equals(this.lastNotifiedOrientation)){
            //console.log("new orientation detected----------------------------------");
        for (var i = this.listeners.length - 1; i >= 0; i--) {
            //console.log("listener:", this.listeners[i]);
            this.listeners[i].onOrientationChange(sameOrientation);
        }
        //}
        //this.lastNotifiedOrientation = lastSensedOrientation;
    };
    this.start = function(){ 
        window.addEventListener("deviceorientation", this.handleOrientation, true);
        this.intervalId = setInterval(function(){ 
            //Este simula el sensado cada dos segundos
            me.notifyContextChange();  
        }, 1000);
    };
    this.stop = function(){ 

        window.removeEventListener("deviceorientation", this.handleOrientation, true);
        clearInterval(this.intervalId);
    };
};

}catch(err){console.log(err)}