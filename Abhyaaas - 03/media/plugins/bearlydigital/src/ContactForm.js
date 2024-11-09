import Field from "./Field";

export default class ContactForm {
    fields = [];
    element = undefined;
    live = false;
    redirect = false;
    successMessage = false;
    obscurity = "";
    token = "";

    constructor(element) {
        console.log("oh look, 1 form");
        this.element = element;
        let rules = JSON.parse(this.element.dataset.rules) ? ? {};
        this.live = this.element.dataset.live ?
            this.element.dataset.live.toLowerCase() === "true" :
            false;
        this.redirect = this.element.dataset.redirect ? ? false;
        this.successMessage = this.element.querySelector("[data-success]") ? ? false;
        this.token = this.element.dataset.token ? ? "";
        if (this.token === "") {
            console.warn("Missing data-token on form");
        }

        // Field setup
        for (const fe of this.element.querySelectorAll(
                "input, textarea, .radio-group, select"
            )) {
            if (fe.type === "radio") {
                continue;
            }
            if (fe.classList.contains("radio-group")) {
                const field = new Field(fe, rules[fe.dataset.name] ? ? {}, this);
                this.fields.push(field);
            } else {
                const field = new Field(fe, rules[fe.name] ? ? {}, this);
                this.fields.push(field);
            }
        }

        // Events
        this.element.addEventListener("submit", (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.submit();
        });

        // Start hash generation
        this.hashInit();
    }

    async hashInit() {
        this.obscurity = `${this.token}:${await this.hashCash()}`;
    }

    async submit() {
        const payload = {
            target: this.element.dataset.target,
            field: this.element.dataset.field,
            fields: {},
            obscurity: this.obscurity,
        };

        let valid = true;
        for (const field of this.fields) {
            if (!field.validate()) {
                valid = false;
            }
            payload.fields[field.name] = field.value;
        }

        if (!valid) {
            this.element.dispatchEvent(new Event("validation-failed"));
            return false;
        } else {
            this.element.dispatchEvent(new Event("validation-succeeded"));
        }

        // Wait for hashCash
        while (this.obscurity === "") {
            await this.delay(1000);
        }

        const response = await fetch(this.element.action, {
            method: "post",
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!data.valid) {
            this.propagateErrors(data.errors);
            return 0;
        }

        if (!data.hashValid) {
            this.token = data.newHash;
            this.obscurity = "";
            this.hashInit();
            console.warn(
                "Hash had expired. Re-submitting with new hash. Performance may be worse for this specific request"
            );
            return this.submit();
        }

        if (this.redirect) {
            window.location.href = this.redirect;
        } else if (this.successMessage) {
            this.successMessage.style.display = "block";
        } else {
            console.warn(
                "Form submit was successfull, but neither a redirect nor a success message element are present"
            );
        }
        this.element.dispatchEvent(new Event("success"));
    }

    propagateErrors(errors) {
        for (const error of errors) {
            for (const field of this.fields) {
                if (field.name === error) {
                    field.showError();
                }
            }
        }
    }

    async delay(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }

    async hashCash(num = 0) {
        const text = `${this.token}:${num}`;
        const digest = await this.sha1(text);
        const check = digest.slice(0, 4);
        let valid = true;
        for (const val of check) {
            if (val !== "0") {
                valid = false;
            }
        }
        if (valid) {
            return num;
        } else {
            return this.hashCash(num + 1);
        }
    }

    async sha1(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
}