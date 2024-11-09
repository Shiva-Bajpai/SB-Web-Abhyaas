(() => {
    // src/Validator.js
    var Validator = class {
        rules = {};
        constructor(rules) {
            this.rules = rules;
        }
        validate(value) {
            let valid = true;
            for (let rule of Object.keys(this.rules)) {
                rule = rule.toLowerCase();
                if (rule in this.methods) {
                    valid = valid && this.methods[rule](value, this.rules[rule]);
                    if (!this.methods[rule](value, this.rules[rule])) {}
                } else {
                    console.warn(`Validation rule not implemented in JS: ${rule}`);
                }
            }
            return valid;
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
                const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
                return value === true;
            }
        };
    };

    // src/Field.js
    var Field = class {
        rules = [];
        form = void 0;
        validator = void 0;
        valid = true;
        loading = false;
        fileValue = "";
        fileName = "";
        constructor(element, rules, form) {
            this.element = element;
            this.form = form;
            if (rules) {
                this.rules = rules;
                this.validator = new Validator(this.rules);
            } else {
                this.validator = new Validator({});
            }
            if (this.element.type === "file") {
                this.element.addEventListener("change", (evt) => {
                    this.loadFile();
                });
            }
            if (form.live) {
                this.element.addEventListener("input", (e) => {
                    if (!this.valid) {
                        this.validate();
                    }
                });
            }
        }
        validate() {
            this.valid = this.validator.validate(this.value);
            if (this.valid) {
                this.hideError();
            } else {
                this.showError();
            }
            return this.valid;
        }
        showError() {
            this.element.classList.add("has-error");
            this.element.dispatchEvent(new Event("validation-failed"));
            for (const label of this.form.element.querySelectorAll(
                    `label[for="${this.name}"]`
                )) {
                label.classList.add("has-error");
            }
        }
        hideError() {
            this.element.classList.remove("has-error");
            if (this.validator.validate(this.value)) {
                this.element.dispatchEvent(new Event("validation-succeeded"));
            }
            for (const label of this.form.element.querySelectorAll(
                    `label[for="${this.name}"]`
                )) {
                label.classList.remove("has-error");
            }
            const matchingElements = this.form.element.querySelectorAll(
                `input[type="checkbox"][name="${this.element.name}"]`
            );
            for (const elem of matchingElements) {
                elem.classList.remove("has-error");
            }
        }
        async loadFile() {
            if (this.element.files) {
                const reader = new FileReader();
                reader.readAsDataURL(this.element.files[0]);
                reader.onload = () => {
                    this.fileValue = reader.result;
                    this.fileName = this.element.files[0].name;
                };
            }
        }
        get name() {
            if (this.element.classList.contains("radio-group")) {
                return this.element.dataset.name;
            } else {
                return this.element.name;
            }
        }
        get value() {
            if (this.element.type === "checkbox") {
                const matchingElements = this.form.element.querySelectorAll(
                    `input[type="checkbox"][name="${this.element.name}"]`
                );
                if (matchingElements.length > 1) {
                    let values = [];
                    for (const elem of matchingElements) {
                        console.log(elem.checked);
                        if (elem.checked) {
                            values.push(elem.value);
                        }
                    }
                    return values.join(", ");
                } else {
                    return this.element.checked;
                }
            } else if (this.element.type === "file") {
                if (this.fileValue === "") {
                    return "";
                }
                return {
                    value: this.fileValue,
                    name: this.fileName
                };
            } else if (this.element.classList.contains("radio-group")) {
                let result = "";
                for (const elem of this.element.querySelectorAll('input[type="radio"]')) {
                    if (elem.checked) {
                        result = elem.value;
                    }
                }
                return result;
            } else {
                return this.element.value;
            }
        }
    };

    // src/ContactForm.js
    var ContactForm = class {
        fields = [];
        element = void 0;
        live = false;
        redirect = false;
        successMessage = false;
        obscurity = "";
        token = "";
        constructor(element) {
            this.element = element;
            let rules = JSON.parse(this.element.dataset.rules) ? ? {};
            this.live = this.element.dataset.live ? this.element.dataset.live.toLowerCase() === "true" : false;
            this.redirect = this.element.dataset.redirect ? ? false;
            this.successMessage = this.element.querySelector("[data-success]") ? ? false;
            this.token = this.element.dataset.token ? ? "";
            if (this.token === "") {
                console.warn("Missing data-token on form");
            }
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
            this.element.addEventListener("submit", (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.submit();
            });
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
                obscurity: this.obscurity
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
            while (this.obscurity === "") {
                await this.delay(1e3);
            }
            const response = await fetch(this.element.action, {
                method: "post",
                body: JSON.stringify(payload)
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
    };

    // src/index.js
    window.bearly = {};
    window.bearly.loadforms = () => {
        for (const form of document.querySelectorAll("form")) {
            if (form.dataset["smart"] && form.dataset["smart"] === "true") {
                const formObj = new ContactForm(form);
            }
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL1ZhbGlkYXRvci5qcyIsICIuLi9zcmMvRmllbGQuanMiLCAiLi4vc3JjL0NvbnRhY3RGb3JtLmpzIiwgIi4uL3NyYy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFsaWRhdG9yIHtcbiAgcnVsZXMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihydWxlcykge1xuICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgfVxuXG4gIHZhbGlkYXRlKHZhbHVlKSB7XG4gICAgbGV0IHZhbGlkID0gdHJ1ZVxuICAgIGZvciAobGV0IHJ1bGUgb2YgT2JqZWN0LmtleXModGhpcy5ydWxlcykpIHtcbiAgICAgIHJ1bGUgPSBydWxlLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmIChydWxlIGluIHRoaXMubWV0aG9kcykge1xuICAgICAgICB2YWxpZCA9IHZhbGlkICYmIHRoaXMubWV0aG9kc1tydWxlXSh2YWx1ZSwgdGhpcy5ydWxlc1tydWxlXSlcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZHNbcnVsZV0odmFsdWUsIHRoaXMucnVsZXNbcnVsZV0pKSB7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgVmFsaWRhdGlvbiBydWxlIG5vdCBpbXBsZW1lbnRlZCBpbiBKUzogJHtydWxlfWApXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZFxuICB9XG5cbiAgbWV0aG9kcyA9IHtcbiAgICBtYXgodmFsdWUsIG9wdGlvbikge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIDw9IG9wdGlvbjtcbiAgICB9LFxuICAgIG1pbih2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgPj0gb3B0aW9uO1xuICAgIH0sXG4gICAgbWF4bGVuZ3RoKHZhbHVlLCBvcHRpb24pIHtcbiAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPD0gb3B0aW9uO1xuICAgIH0sXG4gICAgbWlubGVuZ3RoKHZhbHVlLCBvcHRpb24pIHtcbiAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPj0gb3B0aW9uO1xuICAgIH0sXG4gICAgcmVxdWlyZWQodmFsdWUsIG9wdGlvbikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggIT09IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUgIT09IFwiXCI7XG4gICAgfSxcbiAgICBtYXh3b3Jkcyh2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsdWUuc3BsaXQoXCIgXCIpLmxlbmd0aCA8PSBvcHRpb247XG4gICAgfSxcbiAgICBtaW53b3Jkcyh2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsdWUuc3BsaXQoXCIgXCIpLmxlbmd0aCA+PSBvcHRpb247XG4gICAgfSxcbiAgICBlbWFpbCh2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICBjb25zdCByZXMgPVxuICAgICAgICAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvO1xuICAgICAgcmV0dXJuIHJlcy50ZXN0KHZhbHVlLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0sXG4gICAgYWxwaGEodmFsdWUsIG9wdGlvbikge1xuICAgICAgcmV0dXJuIHZhbHVlLm1hdGNoKFwiXlthLXpBLVpdKiRcIik7XG4gICAgfSxcbiAgICBhbHBoYW51bSh2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsdWUubWF0Y2goXCJeW2EtekEtWjAtOV0qJFwiKTtcbiAgICB9LFxuICAgIGNvbnRhaW5zKHZhbHVlLCBvcHRpb24pIHtcbiAgICAgIHJldHVybiB2YWx1ZS5pbmNsdWRlcyhvcHRpb24pO1xuICAgIH0sXG4gICAgbm90Y29udGFpbnModmFsdWUsIG9wdGlvbikge1xuICAgICAgcmV0dXJuICF2YWx1ZS5pbmNsdWRlcyhvcHRpb24pO1xuICAgIH0sXG4gICAgaW50ZWdlcih2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KHZhbHVlKSk7XG4gICAgfSxcbiAgICBub3RlbXB0eSh2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUgPT09IFwiXCI7XG4gICAgfSxcbiAgICBzdGFydHN3aXRoKHZhbHVlLCBvcHRpb24pIHtcbiAgICAgIHJldHVybiB2YWx1ZS5zdGFydHN3aXRoKG9wdGlvbik7XG4gICAgfSxcbiAgICBlbmRzd2l0aCh2YWx1ZSwgb3B0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsdWUuZW5kc3dpdGgob3B0aW9uKTtcbiAgICB9LFxuICAgIGFjY2VwdGVkKHZhbHVlLCBvcHRpb24pIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZVxuICAgIH1cbiAgfTtcbn1cbiIsICJpbXBvcnQgVmFsaWRhdG9yIGZyb20gXCIuL1ZhbGlkYXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWVsZCB7XG4gIHJ1bGVzID0gW107XG4gIGZvcm0gPSB1bmRlZmluZWQ7XG4gIHZhbGlkYXRvciA9IHVuZGVmaW5lZDtcbiAgdmFsaWQgPSB0cnVlO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIGZpbGVWYWx1ZSA9IFwiXCI7XG4gIGZpbGVOYW1lID0gXCJcIjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBydWxlcywgZm9ybSkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICBpZiAocnVsZXMpIHtcbiAgICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgICAgIHRoaXMudmFsaWRhdG9yID0gbmV3IFZhbGlkYXRvcih0aGlzLnJ1bGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWxpZGF0b3IgPSBuZXcgVmFsaWRhdG9yKHt9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbGVtZW50LnR5cGUgPT09IFwiZmlsZVwiKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZ0KSA9PiB7XG4gICAgICAgIHRoaXMubG9hZEZpbGUoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmb3JtLmxpdmUpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnZhbGlkKSB7XG4gICAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICB0aGlzLnZhbGlkID0gdGhpcy52YWxpZGF0b3IudmFsaWRhdGUodGhpcy52YWx1ZSk7XG4gICAgaWYgKHRoaXMudmFsaWQpIHtcbiAgICAgIHRoaXMuaGlkZUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd0Vycm9yKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZhbGlkO1xuICB9XG5cbiAgc2hvd0Vycm9yKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGFzLWVycm9yXCIpO1xuICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInZhbGlkYXRpb24tZmFpbGVkXCIpKTtcbiAgICBmb3IgKGNvbnN0IGxhYmVsIG9mIHRoaXMuZm9ybS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgbGFiZWxbZm9yPVwiJHt0aGlzLm5hbWV9XCJdYFxuICAgICkpIHtcbiAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoXCJoYXMtZXJyb3JcIik7XG4gICAgfVxuICB9XG5cbiAgaGlkZUVycm9yKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiaGFzLWVycm9yXCIpO1xuICAgIGlmICh0aGlzLnZhbGlkYXRvci52YWxpZGF0ZSh0aGlzLnZhbHVlKSkge1xuICAgICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwidmFsaWRhdGlvbi1zdWNjZWVkZWRcIikpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGxhYmVsIG9mIHRoaXMuZm9ybS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgbGFiZWxbZm9yPVwiJHt0aGlzLm5hbWV9XCJdYFxuICAgICkpIHtcbiAgICAgIGxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoXCJoYXMtZXJyb3JcIik7XG4gICAgfVxuICAgIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIG11bHRpc2VsZWN0c1xuICAgIGNvbnN0IG1hdGNoaW5nRWxlbWVudHMgPSB0aGlzLmZvcm0uZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYGlucHV0W3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwiJHt0aGlzLmVsZW1lbnQubmFtZX1cIl1gXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IGVsZW0gb2YgbWF0Y2hpbmdFbGVtZW50cykge1xuICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiaGFzLWVycm9yXCIpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWRGaWxlKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQuZmlsZXMpIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTCh0aGlzLmVsZW1lbnQuZmlsZXNbMF0pO1xuICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5maWxlVmFsdWUgPSByZWFkZXIucmVzdWx0O1xuICAgICAgICB0aGlzLmZpbGVOYW1lID0gdGhpcy5lbGVtZW50LmZpbGVzWzBdLm5hbWU7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicmFkaW8tZ3JvdXBcIikpIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGF0YXNldC5uYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hbWU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICBjb25zdCBtYXRjaGluZ0VsZW1lbnRzID0gdGhpcy5mb3JtLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgYGlucHV0W3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwiJHt0aGlzLmVsZW1lbnQubmFtZX1cIl1gXG4gICAgICApO1xuICAgICAgaWYgKG1hdGNoaW5nRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsZXQgdmFsdWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZWxlbSBvZiBtYXRjaGluZ0VsZW1lbnRzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZWxlbS5jaGVja2VkKTtcbiAgICAgICAgICBpZiAoZWxlbS5jaGVja2VkKSB7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaChlbGVtLnZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlcy5qb2luKFwiLCBcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNoZWNrZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnQudHlwZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgIGlmICh0aGlzLmZpbGVWYWx1ZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB0aGlzLmZpbGVWYWx1ZSxcbiAgICAgICAgbmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicmFkaW8tZ3JvdXBcIikpIHtcbiAgICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgICAgZm9yIChjb25zdCBlbGVtIG9mIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKSkge1xuICAgICAgICBpZiAoZWxlbS5jaGVja2VkKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZWxlbS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC52YWx1ZTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgRmllbGQgZnJvbSBcIi4vRmllbGRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGFjdEZvcm0ge1xuICBmaWVsZHMgPSBbXTtcbiAgZWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgbGl2ZSA9IGZhbHNlO1xuICByZWRpcmVjdCA9IGZhbHNlO1xuICBzdWNjZXNzTWVzc2FnZSA9IGZhbHNlO1xuICBvYnNjdXJpdHkgPSBcIlwiO1xuICB0b2tlbiA9IFwiXCI7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIGNvbnNvbGUubG9nKFwib2ggbG9vaywgMSBmb3JtXCIpO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgbGV0IHJ1bGVzID0gSlNPTi5wYXJzZSh0aGlzLmVsZW1lbnQuZGF0YXNldC5ydWxlcykgPz8ge307XG4gICAgdGhpcy5saXZlID0gdGhpcy5lbGVtZW50LmRhdGFzZXQubGl2ZVxuICAgICAgPyB0aGlzLmVsZW1lbnQuZGF0YXNldC5saXZlLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiXG4gICAgICA6IGZhbHNlO1xuICAgIHRoaXMucmVkaXJlY3QgPSB0aGlzLmVsZW1lbnQuZGF0YXNldC5yZWRpcmVjdCA/PyBmYWxzZTtcbiAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1zdWNjZXNzXVwiKSA/PyBmYWxzZTtcbiAgICB0aGlzLnRva2VuID0gdGhpcy5lbGVtZW50LmRhdGFzZXQudG9rZW4gPz8gXCJcIjtcbiAgICBpZiAodGhpcy50b2tlbiA9PT0gXCJcIikge1xuICAgICAgY29uc29sZS53YXJuKFwiTWlzc2luZyBkYXRhLXRva2VuIG9uIGZvcm1cIik7XG4gICAgfVxuXG4gICAgLy8gRmllbGQgc2V0dXBcbiAgICBmb3IgKGNvbnN0IGZlIG9mIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgXCJpbnB1dCwgdGV4dGFyZWEsIC5yYWRpby1ncm91cCwgc2VsZWN0XCJcbiAgICApKSB7XG4gICAgICBpZiAoZmUudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZlLmNsYXNzTGlzdC5jb250YWlucyhcInJhZGlvLWdyb3VwXCIpKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKGZlLCBydWxlc1tmZS5kYXRhc2V0Lm5hbWVdID8/IHt9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5maWVsZHMucHVzaChmaWVsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmaWVsZCA9IG5ldyBGaWVsZChmZSwgcnVsZXNbZmUubmFtZV0gPz8ge30sIHRoaXMpO1xuICAgICAgICB0aGlzLmZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFdmVudHNcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuc3VibWl0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdGFydCBoYXNoIGdlbmVyYXRpb25cbiAgICB0aGlzLmhhc2hJbml0KCk7XG4gIH1cblxuICBhc3luYyBoYXNoSW5pdCgpIHtcbiAgICB0aGlzLm9ic2N1cml0eSA9IGAke3RoaXMudG9rZW59OiR7YXdhaXQgdGhpcy5oYXNoQ2FzaCgpfWA7XG4gIH1cblxuICBhc3luYyBzdWJtaXQoKSB7XG4gICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgIHRhcmdldDogdGhpcy5lbGVtZW50LmRhdGFzZXQudGFyZ2V0LFxuICAgICAgZmllbGQ6IHRoaXMuZWxlbWVudC5kYXRhc2V0LmZpZWxkLFxuICAgICAgZmllbGRzOiB7fSxcbiAgICAgIG9ic2N1cml0eTogdGhpcy5vYnNjdXJpdHksXG4gICAgfTtcblxuICAgIGxldCB2YWxpZCA9IHRydWU7XG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiB0aGlzLmZpZWxkcykge1xuICAgICAgaWYgKCFmaWVsZC52YWxpZGF0ZSgpKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXlsb2FkLmZpZWxkc1tmaWVsZC5uYW1lXSA9IGZpZWxkLnZhbHVlO1xuICAgIH1cblxuICAgIGlmICghdmFsaWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInZhbGlkYXRpb24tZmFpbGVkXCIpKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwidmFsaWRhdGlvbi1zdWNjZWVkZWRcIikpO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIGhhc2hDYXNoXG4gICAgd2hpbGUgKHRoaXMub2JzY3VyaXR5ID09PSBcIlwiKSB7XG4gICAgICBhd2FpdCB0aGlzLmRlbGF5KDEwMDApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godGhpcy5lbGVtZW50LmFjdGlvbiwge1xuICAgICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgIH0pO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKCFkYXRhLnZhbGlkKSB7XG4gICAgICB0aGlzLnByb3BhZ2F0ZUVycm9ycyhkYXRhLmVycm9ycyk7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGEuaGFzaFZhbGlkKSB7XG4gICAgICB0aGlzLnRva2VuID0gZGF0YS5uZXdIYXNoO1xuICAgICAgdGhpcy5vYnNjdXJpdHkgPSBcIlwiO1xuICAgICAgdGhpcy5oYXNoSW5pdCgpO1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIkhhc2ggaGFkIGV4cGlyZWQuIFJlLXN1Ym1pdHRpbmcgd2l0aCBuZXcgaGFzaC4gUGVyZm9ybWFuY2UgbWF5IGJlIHdvcnNlIGZvciB0aGlzIHNwZWNpZmljIHJlcXVlc3RcIlxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzLnN1Ym1pdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZGlyZWN0KSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHRoaXMucmVkaXJlY3Q7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICB0aGlzLnN1Y2Nlc3NNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJGb3JtIHN1Ym1pdCB3YXMgc3VjY2Vzc2Z1bGwsIGJ1dCBuZWl0aGVyIGEgcmVkaXJlY3Qgbm9yIGEgc3VjY2VzcyBtZXNzYWdlIGVsZW1lbnQgYXJlIHByZXNlbnRcIlxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwic3VjY2Vzc1wiKSk7XG4gIH1cblxuICBwcm9wYWdhdGVFcnJvcnMoZXJyb3JzKSB7XG4gICAgZm9yIChjb25zdCBlcnJvciBvZiBlcnJvcnMpIHtcbiAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgdGhpcy5maWVsZHMpIHtcbiAgICAgICAgaWYgKGZpZWxkLm5hbWUgPT09IGVycm9yKSB7XG4gICAgICAgICAgZmllbGQuc2hvd0Vycm9yKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBkZWxheShtaWxsaXNlY29uZHMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbWlsbGlzZWNvbmRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGhhc2hDYXNoKG51bSA9IDApIHtcbiAgICBjb25zdCB0ZXh0ID0gYCR7dGhpcy50b2tlbn06JHtudW19YDtcbiAgICBjb25zdCBkaWdlc3QgPSBhd2FpdCB0aGlzLnNoYTEodGV4dCk7XG4gICAgY29uc3QgY2hlY2sgPSBkaWdlc3Quc2xpY2UoMCwgNCk7XG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBjaGVjaykge1xuICAgICAgaWYgKHZhbCAhPT0gXCIwXCIpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhbGlkKSB7XG4gICAgICByZXR1cm4gbnVtO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNoQ2FzaChudW0gKyAxKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzaGExKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBtc2dCdWZmZXIgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUobWVzc2FnZSk7XG4gICAgY29uc3QgaGFzaEJ1ZmZlciA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTFcIiwgbXNnQnVmZmVyKTtcbiAgICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2hCdWZmZXIpKTtcbiAgICByZXR1cm4gaGFzaEFycmF5Lm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgXCIwXCIpKS5qb2luKFwiXCIpO1xuICB9XG59XG4iLCAiaW1wb3J0IENvbnRhY3RGb3JtIGZyb20gXCIuL0NvbnRhY3RGb3JtXCI7XG5cbndpbmRvdy5iZWFybHkgPSB7fVxud2luZG93LmJlYXJseS5sb2FkZm9ybXMgPSAoKSA9PiB7XG4gIGZvciAoY29uc3QgZm9ybSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiZm9ybVwiKSkge1xuICAgIGlmIChmb3JtLmRhdGFzZXRbXCJzbWFydFwiXSAmJiBmb3JtLmRhdGFzZXRbXCJzbWFydFwiXSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIGNvbnN0IGZvcm1PYmogPSBuZXcgQ29udGFjdEZvcm0oZm9ybSk7XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQUFBLE1BQXFCLFlBQXJCLE1BQStCO0FBQUEsSUFDN0IsUUFBUSxDQUFDO0FBQUEsSUFFVCxZQUFZLE9BQU87QUFDakIsV0FBSyxRQUFRO0FBQUEsSUFDZjtBQUFBLElBRUEsU0FBUyxPQUFPO0FBQ2QsVUFBSSxRQUFRO0FBQ1osZUFBUyxRQUFRLE9BQU8sS0FBSyxLQUFLLEtBQUssR0FBRztBQUN4QyxlQUFPLEtBQUssWUFBWTtBQUN4QixZQUFJLFFBQVEsS0FBSyxTQUFTO0FBQ3hCLGtCQUFRLFNBQVMsS0FBSyxRQUFRLE1BQU0sT0FBTyxLQUFLLE1BQU0sS0FBSztBQUMzRCxjQUFJLENBQUMsS0FBSyxRQUFRLE1BQU0sT0FBTyxLQUFLLE1BQU0sS0FBSyxHQUFHO0FBQUEsVUFDbEQ7QUFBQSxRQUNGLE9BQU87QUFDTCxrQkFBUSxLQUFLLDBDQUEwQyxNQUFN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