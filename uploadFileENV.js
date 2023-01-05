const {uploadFileENV} = require("./uploadFile");
require('dotenv').config();

uploadFileENV(process.env.FOLDER_ID_ENV).then(() => {
    console.log("UPLOAD FILE EVN SUCCESS")
})