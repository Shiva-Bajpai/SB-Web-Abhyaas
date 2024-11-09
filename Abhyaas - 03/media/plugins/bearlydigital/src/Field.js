import Validator from "./Validator";

export default class Field {
    rules = [];
    form = undefined;
    validator = undefined;
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
        // Special handling for multiselects
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
                name: this.fileName,
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
}