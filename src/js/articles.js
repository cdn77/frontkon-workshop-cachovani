const articleCount = document.querySelectorAll("article").length;

document.querySelector("#app").innerHTML = `
    Found ${articleCount} articles.
`;
