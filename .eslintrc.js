module.exports = {
    "globals": {
        "Page": false,
        "wx": false,
    },
    "env": {
        "node": true,
        "es6": true,

    },
    "extends": "eslint:recommended",
    "rules": {
        "semi": ["error", "always"],
            "quotes": "off",
            "no-console":"off",
            "no-unused-vars":"off",
            "no-unreachable":"off",
        "no-underscore-dangle":"off",
        "consistent-return":"off"
    }
};