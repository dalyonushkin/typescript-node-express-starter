import request from "supertest";

import { mirrorApp } from "./mirror-server";

/*mirrorServer:Server;
beforeAll((done) => {
  mirrorServer
  mirrorServer.once("listening", () => {
    done();
  });
});
afterAll((done) => {
  mirrorServer.close(done);
});*/


["/mirror", "/mirror/test", "/mirror/test/test"].forEach((url) => {
  describe(`GET ${url}`, () => {
    it("должен вернуть 200 OK", () => {
      return request(mirrorApp).get(url)
        .expect(200);
    });
    it(`должен вернуть {url:${url}}`, (done) => {
      return request(mirrorApp).get(url).expect(200)
        .then(response => {
          expect(response.body.url).toBe(url);
          expect(response.body.method).toBe("GET");
          done();

        });

    });
  });


  describe(`POST ${url}`, () => {
    it("должен вернуть 200 OK", () => {
      return request(mirrorApp).post(url)
        .expect(200);
    });
    it(`должен вернуть {url:${url}}} с пустым телом`, (done) => {
      return request(mirrorApp).post(url).set("Content-Type", "application/json").expect(200)
        .then(response => {
          expect(response.body.url).toBe(url);
          expect(response.body.method).toBe("POST");
          expect(JSON.stringify(response.body.body)).toBe(JSON.stringify({}));
          done();

        });

    });

    it("должен вернуть body запроса в json", (done) => {
      return request(mirrorApp).post(url).send({"name": "john"}).set("Content-Type", "application/json").expect(200).expect("Content-Type", /json/)
        .then(response => {
          expect(response.body.url).toBe(url);
          expect(response.body.method).toBe("POST");

          expect(JSON.stringify(response.body.body)).toBe(JSON.stringify({"name": "john"}));
          done();

        });

    });
    it("должен вернуть body запроса", (done) => {
      return request(mirrorApp).post(url).type("text").set("Accept", "text/plain").send("{name:\"john11\"").expect(200).expect("Content-Type", /json/)
        .then(response => {
          expect(response.body.url).toBe(url);
          expect(response.body.method).toBe("POST");
          expect(response.body.body).toBe("{name:\"john11\"");
          done();

        });

    });
  });
});
