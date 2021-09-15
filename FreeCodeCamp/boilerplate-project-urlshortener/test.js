const shortid = require("shortid");
const dns = require("dns");

console.log(shortid.generate());

function generateRandomInteger(max) {
  return Math.floor(Math.random() * max) + 1;
}

let value4 = generateRandomInteger(1000);

console.log(value4);

const validateSyntax = (url) => {
  // const pattern = /https?:\/\/([a-zA-Z0-9]*\.)*(com|vn)$/g;
  const pattern = /(https?|ftp):\/{1,2}([a-zA-Z0-9-]*\.)*(com|vn|org)$/g;
  return url.match(pattern);
};
console.log(validateSyntax("ftp:/john-doe.org"));

const options = {
  family: 4,
};
let hostName = "https://zing.vn";
hostName = hostName.split("//");
console.log(hostName);
dns.lookup(hostName[1], options, (err, address, family) => {
  // console.log("address: %j family: IPv%s", address, family);
  console.log("address: ", address);
});
