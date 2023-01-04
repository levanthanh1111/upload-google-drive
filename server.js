const {uploadFile, getFile} = require("./uploadFile");

uploadFile().then(r => {
    getFile('1K5ot1d0SkjsBU5unOEQ8dSpijRWw4RvI').then(() => {
        console.log("get files success")
    } )
    console.log("upload success")
});