const needtext = document.querySelectorAll('.needtext');
const needtext_no_ws = document.querySelectorAll('.needtext-no-ws');
const needtext_no_startn = document.querySelectorAll('.needtext-no-startn');
const needtext_no_tn_startendws = document.querySelectorAll('.needtext-no-tn-startendws');

needtext.forEach(input => {
    input.addEventListener('input', function() { // pass if there is some content that is non-whitespace
        if (/^\s+$/.test(input.value)) {
            input.setCustomValidity('Input cannot consist only of whitespace.');
        } else {
            input.setCustomValidity('');
        }
    });
});

needtext_no_ws.forEach(input => {
    input.addEventListener('input', function () { // no whitespaces entirely
        if (/\s/.test(input.value)) {
            input.setCustomValidity('Input cannot contain whitespace.');
        } else {
            input.setCustomValidity('');
        }
    });
});

needtext_no_startn.forEach(input => {
    input.addEventListener('input', function () { // no starting with newline
        if (/^\s+$/.test(input.value)) {
            input.setCustomValidity('Input cannot consist only of whitespace.');
        } else if (/^\n/.test(input.value)) {
            input.setCustomValidity('Input cannot start with a new line.');
        } else {
            input.setCustomValidity('');
        }
    });
});

needtext_no_tn_startendws.forEach(input => {
    input.addEventListener('input', function () { // no tab/newline, no whitespace at start
        if (/[\t\n]/.test(input.value)) {
            input.setCustomValidity('Input cannot contain tab or newline.');
        } else if (/^\s/.test(input.value)) {
            input.setCustomValidity('Input cannot start with whitespace.');
        } else if (/\s$/.test(input.value)) {
            input.setCustomValidity('Input cannot end with whitespace.');
        } else {
            input.setCustomValidity('');
        }
    });
});