# Form Validator

A pure javascript form validator, written in typescript, working something like parsley
but without any dependencies.

Very much under development, contributions welcome.

## Usage

Select the forms you want to validate by passing the form element to a new FormValidation() instance.

```typescript
import FormValidation from "./form";

// here forms that are going to be validated have the data attribute data-validate
document.querySelectorAll<HTMLFormElement>('form[data-validate]').forEach(form => {
    new FormValidation(form, {validateOnBlur: true});
});
```

### FormValidation Options

| Option                   | Type     | Default value    | Description                                                                                                   |
|--------------------------|----------|------------------|---------------------------------------------------------------------------------------------------------------|
| validateOnKeyUp          | boolean  | false            | Run fields validation after each key press                                                                    |
| validateOnBlur           | boolean  | false            | Run fields validation on blur                                                                                 |
| validateOnSubmit         | boolean  | true             | Run all validators on form submit, if turned off can be called via public form.validateForm() method          |
| validateOnInvalid        | boolean  | true             | Run field validation if browser indicates an HTML5 form error, avoids seeing browsers own validation messages |
| showFirstErrorOnly       | boolean  | true             | Show only the first message if a fields validation failed multiple checks                                     |
| showFunc                 | function | _internal_func_  | Pass your own show error message function to over ride the default behaviour                                  |
| errorContainerClassName  | string   | "error-messages" | The CSS class name for the element wrapping validation messages                                               |
| errorClassName           | string   | "error"          | Thee CSS class name for the element wrapping a validation message                                             |

## Expected form structure

All form inputs, selects and textareas should have a parent element,
suggestion is a label but can be any valid element.

```html
<label class="parent">
    <input name="first_name" type="text" maxlength="50" value=""/>
</label>
```

## Default validation messages
Validation error messages are appended and removed to the parent element as required for example.

```html
<label class="parent">
    <input name="something" type="text" maxlength="50" value=""/>
    <div class="error-messages">
        <div class="error">The field first_name must be no more than 50 characters long.</div>
    </div>
</label>
```

## styling form elements when there's an error

If you need to style the input when there is an error suggestion is to use the :has pseudo selector e.g.

```scss
label:has(.error-messages)  {
    input, textarea, select {
        border: red 1px solid;
    }
}
```

## Rules

Rules are applied through adding data-v-{rule} attributes as well as using standard HTML5 validation
attributes like min="" or maxlength=""

| Input, textarea, select attributes | Description                                                                 |
|------------------------------------|-----------------------------------------------------------------------------|
| required                           | Must have a value or be checked                                             |
| maxlength="n"                      | Value must be no longer than                                                |
| minlength="n"                      | Value must be at least no longer than                                       |
| max="n"                            | Number no bigger than n                                                     |
| min="n"                            | Number no smaller than n                                                    |
| pattern                            | Matches Regex pattern                                                       |
| type="email"                       | Valid email address                                                         |
| type="number"                      | Valid number, integer or floating point can include sign                    |
| data-v-integer                     | Valid integer can have a leading minus sign                                 |
| data-v-digits                      | Purely digits 0-9                                                           |
| data-v-alphanum                    | Only letters and numbers                                                    |
| data-v-url                         | Valid url, scheme is optional                                               |
| data-v-in="v1,v2,v3"               | Field must have a value matching on of the comma sepafrated list            |
| data-v-checked                     | Checkbox is checked great for T&C's                                         |
| data-v-required-with="field_name"  | If "field_name" has a value then the current field should also have a value |
 

## Customer validation message for a rule

For any given rules add a data attribute of `data-v-{rule}="Custom error message"`
allows you to override the default error message.


## Example

A contrived example which shows using standard HTML5 for validation attributes, custom attributes
and custom error messages.

```html
<label class="block">
    <span class="field-label">First name</span>
    <input type="text" class="mt-1 block w-full"
           name="first_name"
           minlength="1"
           maxlength="50"
           data-v-maxlength-msg="Blimey, have you got a shorter first name?"
           placeholder="your first name">
</label>
<label class="block">
    <span class="field-label">First name</span>
    <input type="text" class="mt-1 block w-full"
           name="last_name"
           minlength="1"
           maxlength="50"
           data-v-required-with="first_name"
           data-v-required-with-msg="Required with first name"
           placeholder="your last name">
</label>
```