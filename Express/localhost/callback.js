const posts = [
  { title: "First", body: "this is first" },
  { title: "Second", body: "this is second" },
];

function getPost() {
  setTimeout(() => {
    let output = "";
    posts.forEach((post) => {
      output += `<li>${post.title}</li>`;
    });
    document.body.innerHTML = output;
  }, 1000);
}

function createPost(post, callback) {
  setTimeout(() => {
    posts.push(post);
    callback();
  }, 2000);
}

//getPost();
createPost({ title: "Three", body: "This is three" }, getPost);
