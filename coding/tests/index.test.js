const request = require("supertest");
const app = require("../nodejs/index");

describe("Test the index module", () => {
    it("Connection successful", async () => {
        const res = await request(app)
            .get("/")
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Welcome! This is the API server, Please enter the appropriate path")
    });
    it("Connection failed", async () => {
        const res = await request(app)
            .post("/")
        expect(res.statusCode).toEqual(404);
    });
});