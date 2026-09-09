const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

app.get("/get-property", (req, res) => {
    let file = "most_popular.json";

    if (req.query["highest-price"] === "true") file = "highest_price.json";
    if (req.query["lowest-price"] === "true") file = "lowest_price.json";

    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", file)));
    const items = data.Result.Items;
    const result = req.query.limit ? items.slice(0, Number(req.query.limit)) : items;

    res.json(result);
});

app.get("/images", (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "image-links.json")));
    let img_count = req.query.count ? Number(req.query.count) : 10;
    img_count = Math.min(img_count, data.images.length);

    res.json(data.images.slice(-img_count));
});

// TEST APIs ------ O B S O L E T E -------------------
app.get("/dev", (req, res) => {
    res.json({data: {
        "name": "MD. TANVIR AHMED SIDDIQUE",
        "Designation": "SWE INTERN",
        "Organization": "W3 Engineers Ltd."}});
});

app.get('/404', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'others', '404.html'));
});

app.use((req, res) => {
    res.redirect('/404');
});
// ----------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
