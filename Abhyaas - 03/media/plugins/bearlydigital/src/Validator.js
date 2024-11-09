export default class Validator {
    rules = {};

    constructor(rules) {
        this.rules = rules;
    }

    validate(value) {
        let valid = true
        for (let rule of Object.keys(this.rules)) {
            rule = rule.toLowerCase()
            if (rule in this.methods) {
                valid = valid && this.methods[rule](value, this.rules[rule])
                if (!this.methods[rule](value, this.rules[rule])) {}
            } else {
                console.warn(`Validation rule not implemented in JS: ${rule}`)
            }
        }
        return valid
    }

    methods = {
        max(value, option) {
            return parseFloat(value) <= option;
        },
        min(value, option) {
            return parseFloat(value) >= option;
        },
        maxlength(value, option) {
            return value.length <= option;
        },
        minlength(value, option) {
            return value.length >= option;
        },
        required(value, option) {
            if (Array.isArray(value)) {
                return value.length !== 0;
            }
            return value && value !== "";
        },
        maxwords(value, option) {
            return value.split(" ").length <= option;
        },
        minwords(value, option) {
            return value.split(" ").length >= option;
        },
        email(value, option) {
            const res =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return res.test(value.toLowerCase());
        },
        alpha(value, option) {
            return value.match("^[a-zA-Z]*$");
        },
        alphanum(value, option) {
            return value.match("^[a-zA-Z0-9]*$");
        },
        contains(value, option) {
            return value.includes(option);
        },
        notcontains(value, option) {
            return !value.includes(option);
        },
        integer(value, option) {
            return !isNaN(parseInt(value));
        },
        notempty(value, option) {
            return value && value === "";
        },
        startswith(value, option) {
            return value.startswith(option);
        },
        endswith(value, option) {
            return value.endswith(option);
        },
        accepted(value, option) {
            return value === true
        }
    };
}