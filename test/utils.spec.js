const expect = require("chai").expect;
const utils = require("../helpers/utils");

describe("Utils", () => {
    describe("isAlphaNum", () => {
        it("returns true if string is alphanumeric", () => {
            let result = utils.isAlphaNum("hello");
            expect(result).to.be.true;
        });
        it("returns false if the string is non-alphanumeric", () => {
            let result = utils.isAlphaNum("asdf|+9023");
            expect(result).to.be.false;
        });
        it("returns false if string is empty", () => {
            let result = utils.isAlphaNum("");
            expect(result).to.be.false;
        });
        it("returns false if parameter is not a string", () => {
            let result = utils.isAlphaNum();
            expect(result).to.be.false;
            result = utils.isAlphaNum({ test: "test" });
            expect(result).to.be.false;
        });
    });
});
