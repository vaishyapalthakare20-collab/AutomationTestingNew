let text = 'madam';

let reverse = "";

for (let i = text.length - 1; i >= 0; i--) {
    reverse += text[i];
}

if (text === reverse) {
    console.log("It is a palindrome");
} else {
    console.log("It is not a palindrome");
}