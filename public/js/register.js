// Form fields
const regUsername = document.querySelector('#username');
const regEmail = document.querySelector('#email');
const regPass = document.querySelector('#password');
const regRepPass = document.querySelector('#passwordRepeat');
const regDesc = document.querySelector('#description');

// Register submit button
const registerBtn = document.querySelector('#register-submit');

// Form error text
const err_regUsername = document.querySelector('#reg-username-err');
const err_regEmail = document.querySelector('#reg-email-err');
const err_regRepPass = document.querySelector('#reg-rep-password-err');
const err_regDesc = document.querySelector('#reg-description-err');

// Check if username exists
regUsername?.addEventListener("keyup", async function (e) {
    const username = regUsername.value;
    const url = `/register?username=${username}`;

    // Find username in db
    try {
        const response = await fetch(url);
        if (response.status == 200) {
            err_regUsername.innerText = '';
            registerBtn.disabled = false;
        }
        else if (response.status == 409) {
            err_regUsername.innerText = 'Username is already taken!';
            registerBtn.disabled = true;
        }
    } catch (err) {
        console.error(err);
    }
});

// Check if email is already being used
regEmail?.addEventListener("keyup", async function (e) {
    const email = regEmail.value;
    const url = `/register?email=${email}`;
    console.log(url);

    // Find username in db
    try {
        const response = await fetch(url);
        if (response.status == 200) {
            err_regEmail.innerText = '';
            registerBtn.disabled = false;
        }
        else if (response.status == 409) {
            err_regEmail.innerText = 'Email is already registered!';
            registerBtn.disabled = true;
        }
    } catch (err) {
        console.error(err);
    }
});

// Check if password and repeat password are the same
regRepPass?.addEventListener("input", async function (e) {
    const regPassVal = regPass.value;
    const regRepPassVal = regRepPass.value;

    try {
        if (regPassVal === regRepPassVal) {
            err_regRepPass.innerText = '';
            registerBtn.disabled = false;
        }
        else { // passwords do not match
            err_regRepPass.innerText = 'Passwords do not match.';
            registerBtn.disabled = true;
        }
    } catch (err) {
        console.error(err);
    }
});

// Check if password and repeat password are the same
regDesc?.addEventListener("input", async function (e) {
    const regDescVal = regDesc.value;

    try {
        if (regDescVal.length <= 300) {
            err_regDesc.innerText = '';
            registerBtn.disabled = false;
        }
        else { // description goes over 300 characters
            err_regDesc.innerText = 'Sorry! Keep your description short and sweet. Up to 300 characters only.';
            registerBtn.disabled = true;
        }
    } catch (err) {
        console.error(err);
    }
});