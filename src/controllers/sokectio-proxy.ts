'use strict';

import request from 'request';

import * as _Lo from 'lodash'
import { Socket } from 'socket.io';

export type RestDataHeaders = {[key: string]: any;};
export interface RestDataRequest {
  endPoint: string;
  headers?: RestDataHeaders;
  body?: any;
}


export interface RestDataResponse {
  statusCode: number;
  headers?: RestDataHeaders;
  result?: any;
  error?: any
}

export class SocketClientWorker {
  constructor(protected clientSocketConnection: Socket) {
    console.log("a user connected", clientSocketConnection.client.request.cookies);

    clientSocketConnection.on("disconnect", function() {
      console.log("user disconnected");
    });

    clientSocketConnection.on("restGate", this.restGateApi);
  }

  close() {};
  // Mirror Socket.io <-> REST
  restGateApi = (data: RestDataRequest, fn: (response: RestDataResponse) => void) => {
    let options = {
      json: true,
      'method': 'POST',
      'url': `http://localhost:4000/${data.endPoint}`,
      'headers': {
        'Content-Type': 'application/json'
      },
      body: data.body

    };
    options.headers = Object.assign(options.headers, this.clientSocketConnection.handshake.headers);
    console.log("options", options);
    console.log("connectionHeaders", this.clientSocketConnection.handshake.headers);

    request(options, (error, response, body) => {
      let resp: RestDataResponse = {statusCode: response.statusCode};
      if (response.body) {
        resp.result = response.body;
      }
      if (response.headers) {
        resp.headers = response.headers;
      }
      if (error) {
        resp.error = error;
      }
      fn(resp);
    });
  }
}
