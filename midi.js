export default class Midi {
  constructor() {
    navigator.requestMIDIAccess().then(this.midi);
  }

  midi(response) {
    let midiOutputs = [];
    self = this;

    for (let outputPort of response.outputs.values()) {
      console.log(
        "output ports:",
        outputPort.type,
        outputPort.name,
        outputPort.state
      );
      midiOutputs.push(outputPort);
    }

    for (let inputPort of response.inputs.values()) {
      console.log(
        "input ports:",
        inputPort.type,
        inputPort.name,
        inputPort.state
      );
      connect(inputPort);
    }

    response.onstatechange = midiOnStateChange;

    function midiOnStateChange(event) {
      if (event.port.type == "output") {
        console.log("changed:", outPort.type, outPort.name, outPort.state);
      }

      if (
        event.port.type == "input" &&
        event.port.state == "connected" &&
        !event.port.onmidimessage
      ) {
        connect(event.port);
      }
    }

    function connect(port) {
      console.log("connected:", port.type, port.name);
      port.onmidimessage = midiMessage;
    }
    let midiStatusByte, midiEvent, midiChannel, midiKey, midiVelocity;
    function midiMessage(event) {
      midiStatusByte = event.data[0].toString(16);
      midiEvent = midiStatusByte.substring(0, 1);
      midiChannel = midiStatusByte.substring(1);
      midiKey = event.data[1];
      midiVelocity = event.data[2];
      console.log(
        event.currentTarget.name,
        "-",
        "midiEvent:",
        midiEvent,
        " midiChannel:",
        midiChannel,
        " midiKey:",
        midiKey,
        "midiVelocity",
        midiVelocity
      );
      if (midiEvent == "9") {
        console.log("play");
        //self.play(midiKey, midiChannel, midiVelocity);
      } else {
        console.log("stop");
        //self.stop(midiKey, midiChannel);
      }
    }
  }
}
