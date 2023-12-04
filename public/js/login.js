// Form fields
const loginUsername = document.querySelector('#login-username');

// Login submit button
const loginBtn = document.querySelector('#login-submit');

// Form error text
const err_loginUsername = document.querySelector('#login-username-err');

// Check if username exists
loginUsername?.addEventListener("keyup", async function (e) {
    const username = loginUsername.value;
    const url = `/login?username=${username}`;

    // Find username in db
    try {
        const response = await fetch(url);
        if (response.status == 409) {
            err_loginUsername.innerText = '';
            loginBtn.disabled = false;
        }
        else if (response.status == 200) {
            err_loginUsername.innerText = 'User does not exist.';
            loginBtn.disabled = true;
        }
    } catch (err) {
        console.error(err);
    }
});