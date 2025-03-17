function sanitizeInput(input: string): string {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}

export function validateFormInput(input: string): string {
    return sanitizeInput(input);
}