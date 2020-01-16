import request from "supertest";

import { mirrorApp, mirrorServer } from "./mirror-server";

import assert = require("assert");

beforeAll((done) => {
  mirrorServer.once("listening", () => {
    done();
  });
});
afterAll((done) => {
  mirrorServer.close(done);
});



describe("GET /mirror", () => {
  it("должен вернуть 200 OK", () => {
    return request(mirrorApp).get("/mirror")
      .expect(200);
  });
  it("должен вернуть {}", (done) => {
    return request(mirrorApp).get("/mirror").expect(200)
      .then(response => {
        expect(JSON.stringify(response.body)).toBe(JSON.stringify({}));
        done();

      });

  });
});

describe("POST /mirror", () => {
  it("должен вернуть 200 OK", () => {
    return request(mirrorApp).post("/mirror")
      .expect(200);
  });
  it("должен вернуть {} с пустым телом", (done) => {
    return request(mirrorApp).post("/mirror").set("Content-Type", "application/json").expect(200)
      .then(response => {
        expect(JSON.stringify(response.body)).toBe(JSON.stringify({}));
        done();

      });

  });

  it("должен вернуть body запроса в json", (done) => {
    return request(mirrorApp).post("/mirror").send({"name": "john"}).set("Content-Type", "application/json").expect(200).expect("Content-Type", /json/)
      .then(response => {
        expect(JSON.stringify(response.body)).toBe(JSON.stringify({"name": "john"}));
        done();

      });

  });
  it("должен вернуть body запроса", (done) => {
    return request(mirrorApp).post("/mirror").type("text").set("Accept", "text/plain").send("{name:\"john11\"").expect(200).expect("Content-Type", /text/)
      .then(response => {
        expect(response.text).toBe("{name:\"john11\"");
        done();

      });

  });
});

