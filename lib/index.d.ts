import { HTMLFormValidatableElement } from "./types";
interface FormError {
    name: string;
    element: HTMLElement;
    messages?: string[];
}
interface FormValidationOptions {
    validateOnKeyUp?: boolean;
    validateOnBlur?: boolean;
    validateOnSubmit?: boolean;
    validateOnInvalid?: boolean;
    showFirstErrorOnly?: boolean;
    showFunc?: (error: FormError) => void;
    errorContainerClassName?: string;
    errorClassName?: string;
}
declare class FormValidation {
    private form;
    errors: Map<string, FormError>;
    options: FormValidationOptions;
    constructor(formElm: HTMLFormElement, options?: FormValidationOptions);
    showFieldErrorMessages(error: FormError): void;
    private removeFieldErrorMessages;
    validateForm(): boolean;
    validateField(field: HTMLFormValidatableElement): FormError;
    validateInput(input: HTMLInputElement): {
        name: string;
        element: HTMLInputElement;
        messages: any[];
    };
    private validateTextInput;
    private validateEmailInput;
    private validateNumberInput;
    private validateCheckboxInput;
    private validateTextarea;
    private validateSelect;
}
export default FormValidation;
