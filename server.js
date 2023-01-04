const {uploadFile, getFile} = require("./uploadFile");

uploadFile().then(r => {
    getFile('1K5ot1d0SkjsBU5unOEQ8dSpijRWw4RvI').then(() => {
    } )
    console.log("upload success")
});