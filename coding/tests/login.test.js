const request = require("supertest");
const app = require("../nodejs/index");

describe("Test the login module", () => {
    it("Data not empty", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                "email": "",
                "password": "dfG9Tll1"
            })
        expect(res.body.message).toBe("Data is empty");
    });
    it("format is incorrect", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                "email": "test1.ccnet",
                "password": "df213123123"
            })
        expect(res.body.message).toBe("The email format is incorrect or the password length is less than 6");
    });
    it("Authentication success", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                "email": "test1@ccnet.com.tw",
                "password": "dfG9Tll1"
            })
        expect(res.statusCode).toEqual(200);
    });
    it("Authentication failed", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                "email": "test1@ccnet.com.tw",
                "password": "ddfwecc"
            })
        expect(res.body.message).toBe("Uncertified");
    });
    it("Connection failed", async () => {
        const res = await request(app)
            .get("/api/login")
        expect(res.statusCode).toEqual(404);
    });
});