module.exports = class SDKDebug {
  constructor(localServerAddress) {
    if (!localServerAddress) {
      throw "Bad parameters";
    }

    // Init WS connection.
    this.ws = new WebSocket("ws://" + localServerAddress);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onerror = (event) => {this._wsOnError(event)};
    this.ws.onclose = (event) => {this._wsOnClose(event);}
    this.ws.onmessage = (event) => {this._wsOnMessage(event);}
    this.ws.onopen = () => {
      console.log("WS connected to: ", localServerAddress);
      if (this.onReady) {
        this.onReady()
      }
    };
  }

  ///////////////////////
  /// PRIVATE METHODS ///
  ///////////////////////
  _wsOnError(event) {
    console.error("WS Error", event);
  }

  _wsOnClose(event) {
    console.error("WS Close", event);
  }

  _wsOnMessage(event) {
    this._onSDKMessageCallback(JSON.parse(event.data));
  }

  _wsOnSendError(event) {
    console.error("WS send error", event);
  }

  ////////////////////////
  //// PUBLIC METHODS ////
  ////////////////////////

  // Binding onload callback.
  // SDK
  onSDKMessage(onSDKMessageCallback) {
    this._onSDKMessageCallback = onSDKMessageCallback;
  }

  sendSDKMessage(data) {
    if (!this.ws || this.ws.readyState != WebSocket.OPEN) {
      console.log("Cannot send message, ws connection not open");
      return; // Not loaded.
    } 

    this.ws.send(JSON.stringify(data),this._wsOnSendError);
  }
}