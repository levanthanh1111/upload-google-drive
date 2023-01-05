const {uploadFile, getFile} = require("./uploadFile");
require('dotenv').config();

uploadFile(process.env.FOLDER_ID_DATA).then(() => {
    getFile(process.env.FOLDER_ID_DATA).then(() => {
    } )
    console.log("upload success")
});