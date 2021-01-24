navigator.requestMIDIAccess()
    .then(midi);

function midi(response) {

    for (let outPort of response.outputs.values()) {
        console.log("output ports:", outPort.type, outPort.name, outPort.state);
    }
    for (let inputPort of response.inputs.values()) {
        connect(inputPort);
    }

    response.onstatechange = midiOnStateChange;
    function midiOnStateChange(event) {
        if (event.port.type == "output")
            console.log("changed:", outPort.type, outPort.name, outPort.state);
        if (event.port.type == "input" && event.port.state == "connected" && !event.port.onmidimessage) {
            connect(event.port);
        }
    }

    function connect(port) {
        console.log("connected:", port.type, port.name);
        port.onmidimessage = midiMessage;
    }
    function midiMessage(event) {
        midiStatusByte = event.data[0].toString(16);
        midiEvent = midiStatusByte.substring(0, 1);
        midiChannel = midiStatusByte.substring(1);
        midiKey = event.data[1];
        midiVelocity = event.data[2];
        console.log(event.currentTarget.name, "-", "midiEvent:", midiEvent, " midiChannel:", midiChannel, " midiKey:", midiKey, "midiVelocití", midiVelocity);
    }
}
