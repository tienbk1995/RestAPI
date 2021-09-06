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

// function createPost(post) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       posts.push(post);
//       resolve();
//     }, 2000);
//   });
// }

function createPost(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);
      resolve();
    }, 2000);
  });
}

async function init() {
  await createPost({ title: "Three", body: "This is three" });
  getPost();
}
init();
//getPost();
// createPost({ title: "Three", body: "This is three" }).then(getPost);
