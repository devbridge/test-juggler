import { ApiHelpers } from "test-juggler";

describe("Helpers", () => {
    let apiHelpers = new ApiHelpers({ baseURL: "https://reqres.in" });

    beforeEach(async () => {
        console.log("Running test: " + jasmine["currentTest"].fullName);
    });

    it("should issue GET request", async () => {
        //Arrange, Act
        const response = await apiHelpers.get("/api/users/2");

        //Assert
        expect(response.status).toEqual(200);
    });

    it("should issue POST request", async () => {
        //Arrange, Act
        const response = await apiHelpers.post("/api/users",
            {
                "name": "morpheus",
                "job": "leader"
            });

        //Assert
        expect(response.status).toEqual(201);
    });

    it("should issue PUT request", async () => {
        //Arrange, Act
        const response = await apiHelpers.put("/api/users/2",
            {
                "name": "morpheus",
                "job": "zion resident"
            });

        //Assert
        expect(response.status).toEqual(200);
    });

    it("should issue PATCH request", async () => {
        //Arrange, Act
        const response = await apiHelpers.patch("/api/users/2",
            {
                "name": "morpheus",
                "job": "zion resident"
            });

        //Assert
        expect(response.status).toEqual(200);
    });

    it("should issue DELETE request", async () => {
        //Arrange, Act
        const response = await apiHelpers.delete("/api/users/2");

        //Assert
        expect(response.status).toEqual(204);
    });
    
    it("should issue arbitrary request", async () => {
        //Arrange, Act
        const response = await apiHelpers.request({
            method: "patch",
            url: "/api/users/2",
            data: {
                "name": "morpheus",
                "job": "zion resident"
            }
        });

        //Assert
        expect(response.status).toEqual(200);
    });
    
    it("should handle bad response", async () => {
        //Arrange, Act
        const response = await apiHelpers.get("/api/users/23");

        //Assert
        expect(response.status).toEqual(404);
    });

    it("should verify JSON response", async () => {
        //Arrange, Act
        const response = await apiHelpers.get("/api/users/2");

        //Assert
        expect(response.data.data.first_name).toEqual("Janet");
    });

    it("should convert XML response to JSON", async () => {
        //Arrange
        const response = await apiHelpers.get("https://www.crcind.com/csp/samples/SOAP.Demo.cls?soap_method=AddInteger&Arg1=1&Arg2=2");

        //Act
        const responseJsonData = apiHelpers.parseXml(response.data);

        //Assert
        expect(responseJsonData["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0].AddIntegerResponse[0].AddIntegerResult[0]).toEqual("3");
    });

    it("should issue request with basic auth", async () => {
        //Arrange
        const authedApiHelpers = new ApiHelpers({ 
            baseURL: "https://postman-echo.com",
            auth: {
                username: "postman",
                password: "password"
            }
        });

        //Act
        const response = await authedApiHelpers.get("/basic-auth");

        //Assert
        expect(response.data.authenticated).toBe(true);
    });
});