module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "jest": true,
        "jasmine": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "space-before-function-paren": [
            "error",
            { "anonymous": "always", "named": "never", "asyncArrow": "always" }
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "space-before-blocks": [
            "error",
            "always"
        ],
		"space-infix-ops": [
		    "error", 
			{ "int32Hint": false }
		]
    }
};