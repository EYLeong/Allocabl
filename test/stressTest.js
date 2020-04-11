const synchronized = require("../helpers/synchronized");

const testSDK = {
    admin: {
        createAnonymousGuestUser: () => {
            return {
                loginEmail: "testEmail",
                password: "testPassword",
            };
        },
        askTokenOnBehalf: (email, password) => {
            if (email === "testEmail" && password === "testPassword")
                return { token: "testToken" };
            else throw new Error("incorrect credentials");
        },
    },
};

try {
    for (let i = 0; i < 100; i++) {
        synchronized.loginGuestLocked(
            testSDK,
            {
                id: `${i}`,
                emit: (signal, data) => {
                    console.log(signal, data);
                },
            },
            "finance"
        );
    }
} catch (err) {
    console.log(err);
}
