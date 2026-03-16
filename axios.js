const axios = require("axios");

async function testing() {
    const response = await axios.get("https://api.restful-api.dev/objects/4");
    console.log(response.data.id);
console.log("before testing");

}

console.log("after testing");
testing()