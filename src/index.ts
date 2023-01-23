import {HTMLFormValidatableElement} from "./types";
import * as Rules from './rules';

interface FormError {
    name: string;
    element: HTMLElement;
    messages?: string[];
}

interface FormValidationOptions {
    validateOnKeyUp?: boolean, // field level
    validateOnBlur?: boolean,   // field level
    validateOnSubmit?: boolean, // form
    validateOnInvalid?: boolean, // field level
    showFirstErrorOnly?: boolean,
    showFunc?: (error: FormError) => void,
    errorContainerClassName?: string,
    errorClassName?: string,
}

class FormValidation {
    private form: HTMLFormElement;
    errors: Map<string, FormError>;

    options: FormValidationOptions = {
        validateOnKeyUp: false,
        validateOnBlur: false,
        validateOnSubmit: true,
        validateOnInvalid: true,
        showFirstErrorOnly: true,
        showFunc: (...args) => this.showFieldErrorMessages(...args),
        errorContainerClassName: 'error-messages',
        errorClassName: 'error',
    };

    constructor(formElm: HTMLFormElement, options?: FormValidationOptions) {
        if (options) {
            this.options = {
                ...this.options,
                ...options
            }
        }
        this.errors = new Map<string, FormError>();
        this.form = formElm;

        // form on submit
        if (this.options.validateOnSubmit) {
            this.form.addEventListener('submit', (event) => {
                if (!this.validateForm()) event.preventDefault();
            });
        }

        // field on invalid
        if (this.options.validateOnInvalid) {
            this.form.addEventListener('invalid', (event) => {
                event.preventDefault(); // block, so browser validation does not take over
                this.validateField(event.target as HTMLFormValidatableElement);
                return false;
            }, true);
        }

        // field on blur
        if (this.options.validateOnBlur) {
            this.form.addEventListener('blur', (event) => {
                this.validateField(event.target as HTMLFormValidatableElement);
            }, {capture: true});
        }

        // field on keyup
        if (this.options.validateOnKeyUp) {
            this.form.addEventListener('keyup', (event) => {
                this.validateField(event.target as HTMLFormValidatableElement);
            }, {capture: true});
        }
    }

    showFieldErrorMessages(error: FormError) {
        let msgContainer = error.element.parentElement.querySelector('.' + this.options.errorContainerClassName);
        if (msgContainer) {
            // reuse existing container
            let errorMsgContainers = msgContainer.querySelectorAll('.' + this.options.errorClassName);
            for (let i = 0; i < errorMsgContainers.length; i++) {
                errorMsgContainers[i].remove();
            }
        } else {
            // create new container
            msgContainer = document.createElement('div');
            msgContainer.classList.add(this.options.errorContainerClassName);
            error.element.parentElement.appendChild(msgContainer);
        }
        for (let i = 0; i < error.messages.length; i++) {
            let msg = document.createElement('div');
            msg.classList.add(this.options.errorClassName);
            msg.innerHTML = error.messages[i];
            msgContainer.appendChild(msg);
            if (i===0) error.element.focus();
            if (this.options.showFirstErrorOnly) break;
        }
    }

    private removeFieldErrorMessages(element: HTMLFormValidatableElement) {
        const container = element.parentElement.querySelector('.' + this.options.errorContainerClassName);
        if (container) {
            container.remove();
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll<HTMLFormValidatableElement>('input, textarea, select');
        let scrolled = false;
        this.errors.clear();
        fields.forEach(field => {
            let error = this.validateField(field);
            if (error !== null) {
                this.errors.set(error.name, error);
                if (scrolled === false) {
                    scrolled = true;
                    console.log('scrolling');
                    error.element.scrollIntoView({behavior: 'smooth'});
                }
            }
        });
        return this.errors.size === 0;
    }

    validateField(field: HTMLFormValidatableElement) {
        if (field.hasAttribute('disabled')
            || field.hasAttribute('readonly')) {
            return null;
        }
        let error: FormError | null = null;
        switch (field.tagName.toLowerCase()) {
            case 'input':
                error = this.validateInput(field as HTMLInputElement);
                break;

            case 'textarea':
                error = this.validateTextarea(field as HTMLTextAreaElement);
                break;

            case 'select':
                error = this.validateSelect(field as HTMLSelectElement);
                break;
            default:
                break;
        }
        if (error) {
            this.options.showFunc(error);
        } else {
            this.removeFieldErrorMessages(event.target as HTMLFormValidatableElement);
        }
        return error;
    }

    validateInput(input: HTMLInputElement) {
        let messages: string[] = [];
        switch (input.type) {
            case 'text':
                return this.validateTextInput(input);
            case 'email':
                return this.validateEmailInput(input);
            case 'checkbox':
                return this.validateCheckboxInput(input);
            case 'number':
                return this.validateNumberInput(input);
            case 'button':
            case 'hidden':
            case 'submit':
            case 'reset':
                break;
            default:
                throw new Error(`Unknown input type[${input.type}]`);
        }
        return null;
    }

    private validateTextInput(input: HTMLInputElement) {
        let messages = [];

        messages.push(Rules.required(input));
        messages.push(Rules.maxLength(input));
        messages.push(Rules.minLength(input));
        messages.push(Rules.pattern(input));
        messages.push(Rules.alphanum(input));
        messages.push(Rules.digits(input));
        messages.push(Rules.integer(input));
        messages.push(Rules.url(input));
        messages.push(Rules.matchesOne(input));
        messages.push(Rules.requiredWith(input));

        messages = messages.filter((v) => v !== null);

        return messages.length === 0 ? null : {
            name: input.name,
            element: input,
            messages: messages
        }
    }

    private validateEmailInput(input: HTMLInputElement) {
        let messages = [];

        messages.push(Rules.required(input));
        messages.push(Rules.maxLength(input));
        messages.push(Rules.minLength(input));
        messages.push(Rules.email(input));
        messages.push(Rules.requiredWith(input));

        messages = messages.filter((v) => v !== null);

        return messages.length === 0 ? null : {
            name: input.name,
            element: input,
            messages: messages
        }
    }

    private validateNumberInput(input: HTMLInputElement) {
        let messages = [];

        messages.push(Rules.required(input));
        messages.push(Rules.number(input));
        messages.push(Rules.integer(input));
        messages.push(Rules.max(input));
        messages.push(Rules.min(input));
        messages.push(Rules.requiredWith(input));

        messages = messages.filter((v) => v !== null);

        return messages.length === 0 ? null : {
            name: input.name,
            element: input,
            messages: messages
        }
    }

    private validateCheckboxInput(input: HTMLInputElement) {
        let messages = [];

        messages.push(Rules.checked(input));

        messages = messages.filter((v) => v !== null);

        return messages.length === 0 ? null : {
            name: input.name,
            element: input,
            messages: messages
        }
    }

    private validateTextarea(textarea: HTMLTextAreaElement) {
        let messages = [];

        messages.push(Rules.required(textarea));
        messages.push(Rules.maxLength(textarea));
        messages.push(Rules.requiredWith(textarea));

        messages = messages.filter((v) => v !== null);

        return messages.length === 0 ? null : {
            name: textarea.name,
            element: textarea,
            messages: messages
        }
    }

    private validateSelect(select: HTMLSelectElement) {
        let messages = [];

        messages.push(Rules.required(select));
        messages.push(Rules.matchesOne(select));
        messages.push(Rules.requiredWith(select));

        messages = messages.filter((v) => v !== null);

        return messages.length === 0 ? null : {
            name: select.name,
            element: select,
            messages: messages
        }
    }
}

export default FormValidation;
