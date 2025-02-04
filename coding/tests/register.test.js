const request = require("supertest");
const app = require("../nodejs/index");

describe("Test the register module", () => {
    it("Data not empty", async () => {
        const res = await request(app)
            .post("/api/register")
            .send({
                "username": "test1",
                "email": "",
                "password": "dfG9Tll1"
            })
        expect(res.body.message).toBe("Data is empty");
    });
    it("format is incorrect", async () => {
        const res = await request(app)
            .post("/api/register")
            .send({
                "username": "test1",
                "email": "test1.ccnet",
                "password": "df213123123"
            })
        expect(res.body.message).toBe("The email format is incorrect or the password length is less than 6");
    });
    it("Connection failed", async () => {
        const res = await request(app)
            .get("/api/register")
        expect(res.statusCode).toEqual(404);
    });
});