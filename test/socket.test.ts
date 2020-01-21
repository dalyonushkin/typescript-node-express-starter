import * as apiController from "../src/controllers/sokectio-proxy";

import bodyParser from "body-parser";
import io from "socket.io-client";
import request from "supertest";

import { AddressInfo } from "net";
import { Server } from "http";
import { Socket } from "socket.io";

import { RestDataRequest } from "../src/controllers/sokectio-proxy";
import { server, socketIoServer } from './../src/server';
import { startMirrorServer } from "./mirror-server";

//import { server } from "../src/app";


import assert = require("assert");





let mirrorServer: Server;
let serverAddress: AddressInfo;
let mirrorServerAddress: AddressInfo;
beforeAll((done) => {

  server.once("listening", () => {
    //Просто приведу к типу, для теста пойдет, но если вернется строка, то надо переписать
    serverAddress = <AddressInfo>server.address();


    mirrorServer = startMirrorServer();
    mirrorServer.once("listening", () => {
      //Просто приведу к типу, для теста пойдет, но если вернется строка, то надо переписать
      mirrorServerAddress = <AddressInfo>mirrorServer.address();
      done();
    });
  });
});
afterAll((done) => {
  console.log("Shutting down");
  mirrorServer.close();
  server.close(done);
});

describe("Socket.io подключение", () => {
  it("должно быть успешным", (done) => {

    let socketClient: SocketIOClient.Socket = io(`ws://localhost:${serverAddress.port}/`,

      {
        forceNew: true,
        transportOptions: {
          transports: ['polling'],
          polling: {
            extraHeaders: {
              'Authorization': `Bearer Bearer`
            }
          }
        }
      });
    // (<any>socketClient.io.opts).extraHeaders = {"extraHead": "extraval"};
    console.log(socketClient.io.opts);

    let hasBeenConnected: boolean = false;
    socketClient.once("connect", () => {
      expect(socketClient.connected).toBe(true);
      hasBeenConnected = true;
      socketClient.disconnect();
    });
    socketClient.once("disconnect", () => {
      expect(socketClient.connected).toBe(false);
      expect(hasBeenConnected).toBe(true);
      done();
    });
    socketClient.connect();
  });
});


describe("Socket.io ", () => {
  describe("гейт restGate", () => {
    let socket: SocketIOClient.Socket;
    beforeEach((done) => {

      socket = io(`ws://localhost:${serverAddress.port}/`, {
        forceNew: true,
        transportOptions: {
          transports: ['polling'],
          polling: {
            extraHeaders: {
              'Authorization': `Bearer Bearer`
            }
          }
        }
      });
      socket.once("connect", () => {
        done();
      });
      socket.connect();
    });
    afterEach((done) => {
      socket.once("disconnect", () => {
        done();
      });
      socket.disconnect();
    });
    it("возвращет все параметры запроса", async () => {
      request(server).get("/cookie").expect(200);
      let restData: RestDataRequest = {
        body: {f1: "value", f2: 1},
        headers: {
          'Content-Type': 'application/json'
        },
        endPoint: 'mirror/dummy'
      };
      let data: any = await restGate(socket, restData);
      expect(JSON.stringify(data.result.body)).toBe(JSON.stringify(restData.body));
      expect(data.result.url).toBe(`/${restData.endPoint}`);
      expect(data.result.headers['content-type']).toBe(restData.headers['Content-Type']);
      expect(data.result.headers['authorization']).toBe(`Bearer Bearer`);
    });
  });
  /*describe(`Получает http-only куку`,()=>{
    const session = require('cookie-session')({
      name: 'some-session-name',
      secret: 'some-session-secret', // or an array of keys as usual
      ... // Other relevant options
  });
  })*/
});


function restGate(socket: any, restData: RestDataRequest) {
  return new Promise(function(resolve, reject) {
    socket.emit("restGate", restData, (data: any) => {
      resolve(data);
    });
    //           reject(e); //  e is preferably an `Error`
  });
}

/**
 * Отправка http-only куки с бэка
 * Получение http-only куки с бэка,проверка что она небдоступна из js
 * post
 * get
 * reconnect
 * обновление авторизационной куки
 * переклыдваеное заголовков
 * зацепить авторизационную куку из обычного http запроса и проброcить её в socket.io
 * подключение через сертификат, c проверкой ssl pinning, возможно не будет работать на клиенте т,к. это Node.js-only options for the underlying Engine.IO client.
 * проверка версий библиотек перед подключением
 * запрет работы через websocket, вместо long pooloing, для поддержки заголовков
 * проверка compress
 *
 */

