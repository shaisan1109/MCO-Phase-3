const upvote = document.querySelector("#upvote");
const downvote = document.querySelector("#downvote");

upvote?.addEventListener("click", async function(){
    const post = { score: 1 };
    
    console.log(post);
    
    try {
         const response = await fetch ('/post/:id', {
             method: 'PATCH',
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

downvote?.addEventListener("click", async function(){
    const post = { score: -1 };
    
    console.log(post);

    try {
         const response = await fetch ('/post/:id', {
             method: 'PATCH',
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