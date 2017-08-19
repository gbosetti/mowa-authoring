function Parameter(data){
    this.data = data;
    this.getValue; //Abstract
}

function TextualParameter(data){
    Parameter.call(this, data);
    this.getValue = function(){
        return this.data.value;
    }
}

function PropertyBindedParameter(data, dcprops){
    Parameter.call(this, data);
    this.dcprops = dcprops;
    this.getValue = function(){

        for (i in this.dcProps){
            if (i == this.data.value)
                return this.this.dcProps[i]
        }
    }
}