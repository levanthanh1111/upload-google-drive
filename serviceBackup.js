const {uploadFile, getFile} = require("./uploadFile");
require('dotenv').config();

uploadFile().then(() => {
    getFile(process.env.FOLDER_ID).then(() => {
    } )
    console.log("upload success")
});