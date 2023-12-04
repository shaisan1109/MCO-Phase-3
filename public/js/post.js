const upvote = document.querySelector("#upvote");
const downvote = document.querySelector("#downvote");

upvote.addEventListener("click", async function() {
    const title = document.getElementsByClassName('userpost-title');
    const score = 1;
    const post = {title: title, score: score}

    console.log(post);
    try {
         const response = await fetch ('/post', {
             method: 'PUT',
             body: post,
            headers: {
             'Content-Type': 'application/json'
            }
         });
        if (response.status == 200){
             console.log('request sent succesfully');
        } else {
            console.error('An error has occurred in the server.');
        }
    } catch (err) {
        console.error(err);
    }
});

downvote.addEventListener("click", async function(){
    const title = document.getElementsByClassName('userpost-title');
    const score = -1;
    const post = {title: title, score: score}
    
    console.log(post);
    try {
         const response = await fetch ('/post', {
             method: 'PUT',
             body: post,
            headers: {
             'Content-Type': 'application/json'
            }
         });
        if (response.status == 200){
             console.log('request sent succesfully');
        } else {
            console.error('An error has occurred in the server.');
        }
    } catch (err) {
        console.error(err);
    }
});