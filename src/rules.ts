import { HTMLFormValidatableElement } from "./types";

function required(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("required") && !field.value) {
    return errorMessageOrDefault(field, "required", "This field is required");
  }
  return null;
}

function maxLength(field: HTMLFormValidatableElement) {
  if (
    field.hasAttribute("maxlength") &&
    field.value.length > parseInt(field.getAttribute("maxlength"), 10)
  ) {
    return errorMessageOrDefault(
      field,
      "maxlength",
      `This field can only be ${field.getAttribute(
        "maxlength"
      )} characters long`
    );
  }
  return null;
}

function minLength(field: HTMLFormValidatableElement) {
  if (
    field.hasAttribute("minlength") &&
    field.value.length < parseInt(field.getAttribute("minlength"), 10)
  ) {
    return errorMessageOrDefault(
      field,
      "minlength",
      `This field must be at least ${field.getAttribute(
        "minlength"
      )} characters long`
    );
  }
  return null;
}

function min(field: HTMLFormValidatableElement) {
  if (
    field.hasAttribute("min") &&
    parseFloat(field.value) < parseFloat(field.getAttribute("min"))
  ) {
    return errorMessageOrDefault(
      field,
      "min",
      `Value must be greater or equal to ${field.getAttribute("min")}`
    );
  }
  return null;
}

function max(field: HTMLFormValidatableElement) {
  if (
    field.hasAttribute("max") &&
    parseFloat(field.value) > parseFloat(field.getAttribute("max"))
  ) {
    return errorMessageOrDefault(
      field,
      "max",
      `Value must be less or equal to ${field.getAttribute("max")}`
    );
  }
  return null;
}

function email(field: HTMLFormValidatableElement) {
  const emailRegex =
    /^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))$/;
  const msg = errorMessageOrDefault(
    field,
    "email",
    "This field must be a valid email"
  );
  return _matchesRegex(field, emailRegex, msg);
}

function number(field: HTMLFormValidatableElement) {
  // Follow https://www.w3.org/TR/html5/infrastructure.html#floating-point-numbers
  const msg = errorMessageOrDefault(
    field,
    "number",
    "This field must be a number"
  );
  return _matchesRegex(field, /^-?(\d*\.)?\d+(e[-+]?\d+)?$/i, msg);
}

function url(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("data-v-url")) {
    const regex = new RegExp(
      "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)?" + // ** mod: make scheme optional
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        // "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +   // ** mod: allow local networks
        // "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
        // "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:/\\S*)?" +
        "$"
    );
    const msg = errorMessageOrDefault(field, "url", "This field must be a URL");
    return _matchesRegex(field, /^-?\d+$/, msg);
  }
  return null;
}

function integer(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("data-v-integer")) {
    return _matchesRegex(
      field,
      /^-?\d+$/,
      errorMessageOrDefault(field, "integer", "This field must be an integer")
    );
  }
  return null;
}

function digits(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("data-v-digits")) {
    return _matchesRegex(
      field,
      /^\d+$/,
      errorMessageOrDefault(
        field,
        "digits",
        "This field must be an unsigned integer"
      )
    );
  }
  return null;
}

function alphanum(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("data-v-alphanum")) {
    return _matchesRegex(
      field,
      /^\w+$/i,
      errorMessageOrDefault(
        field,
        "alphanum",
        "This field must be alphanumeric"
      )
    );
  }
  return null;
}

function pattern(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("pattern")) {
    const regex = new RegExp(field.getAttribute("pattern"));
    return _matchesRegex(
      field,
      regex,
      errorMessageOrDefault(
        field,
        "pattern",
        "This field does not match the required pattern"
      )
    );
  }
  return null;
}

function _matchesRegex(field: HTMLFormValidatableElement, regex, error) {
  if (!regex.test(field.value)) {
    return error;
  }
  return null;
}

function matchesOne(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("data-v-in")) {
    const values = field.getAttribute("data-v-in").split(",");
    if (values.indexOf(field.value) === -1) {
      return errorMessageOrDefault(
        field,
        "in",
        `Value must be one of ${field.getAttribute("data-v-in")}`
      );
    }
  }
  return null;
}

function checked(field: HTMLInputElement) {
  if (
    field.hasAttribute("required") ||
    field.hasAttribute("data-v-checked") ||
    field.hasAttribute("data-v-accepted")
  ) {
    if (!field.checked) {
      return errorMessageOrDefault(
        field,
        "required",
        "This field must be checked"
      );
    }
  }
  return null;
}

function requiredWith(field: HTMLFormValidatableElement) {
  if (field.hasAttribute("data-v-required-with")) {
    const fieldHasValue = field.value !== null && field.value !== "";
    const otherFieldName = field.getAttribute("data-v-required-with");
    const otherFieldElm = getFieldByNameInForm(field.form, otherFieldName);
    const otherFieldHasValue = otherFieldElm && otherFieldElm.value;
    if (otherFieldHasValue && !fieldHasValue) {
      return errorMessageOrDefault(
        field,
        "required-with",
        `This field is required with ${otherFieldName}`
      );
    }
  }
  return null;
}

function getFieldByNameInForm(form: HTMLFormElement, name: string) {
  return form.querySelector<HTMLFormValidatableElement>(`[name="${name}"]`);
}

function errorMessageOrDefault(
  field: HTMLFormValidatableElement,
  ruleAttributeName: string,
  defaultError: string
) {
  if (field.hasAttribute(`data-v-${ruleAttributeName}-msg`)) {
    return field.getAttribute(`data-v-${ruleAttributeName}-msg`);
  }
  return defaultError;
}

export {
  required,
  maxLength,
  minLength,
  email,
  number,
  integer,
  digits,
  alphanum,
  max,
  min,
  url,
  matchesOne,
  checked,
  pattern,
  requiredWith,
};
