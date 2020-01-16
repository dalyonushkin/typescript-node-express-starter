import * as apiController from "../src/controllers/api";

import bodyParser from "body-parser";
import io from "socket.io-client";
import request from "supertest";

import { Socket } from "socket.io";

import { app, server, socketIoServer } from "../src/app";

import assert = require("assert");

beforeAll((done) => {
  server.once("listening", () => {
    done();
  });
});
afterAll((done) => {
  server.close(done);
});

describe("GET /api/mirror", () => {
  it("должен вернуть 200 OK", () => {
    return request(app).get("/api/mirror")
      .expect(200);
  });
});
describe("Socket.io подключение", () => {
  it("должно быть успешным", (done) => {
    const socket = io(`ws://localhost:${app.settings.port}/`, {forceNew: true});
    let hasBeenConnected: boolean = false;
    socket.once("connect", () => {
      expect(socket.connected).toBe(true);
      hasBeenConnected = true;
      socket.disconnect();
    });
    socket.once("disconnect", () => {
      expect(socket.connected).toBe(false);
      expect(hasBeenConnected).toBe(true);
      done();
    });
    socket.connect();
  });
});
describe("Socket.io ", () => {
  describe("гейт", () => {
    let socket: SocketIOClient.Socket;
    //jest.setTimeout(10000);
    beforeEach((done) => {
      socket = io(`ws://localhost:${app.settings.port}/`, {forceNew: true});;
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
    it("Вызов restGate", (done) => {
      socket.emit("restGate", "tobi", (data: any) => {
        console.log(data);
        setTimeout(() => done(), 1000);

      });

    });
  });
});


