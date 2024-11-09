import ContactForm from "./ContactForm";

window.bearly = {}
window.bearly.loadforms = () => {
    for (const form of document.querySelectorAll("form")) {
        if (form.dataset["smart"] && form.dataset["smart"] === "true") {
            const formObj = new ContactForm(form);
        }
    }
}