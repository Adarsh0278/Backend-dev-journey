async function apis() {
    try {
        const res = await fetch("https://newsapi.org/v2/everything?q=tesla&from=2026-01-28&sortBy=publishedAt&apiKey=a19b261242b245b892300a920a30a2ab");

        const data = await res.json();

        console.log(data.articles[2].author);

        return data;

    } catch (error) {
        console.error("Something went wrong:", error);
    }
}

apis();