const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;


/* Serve project files */

app.use(
    express.static(__dirname)
);


/* Serve installed npm packages */

app.use(
    "/node_modules",
    express.static(
        path.join(
            __dirname,
            "node_modules"
        )
    )
);


/* Start server */

app.listen(
    PORT,
    function () {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);