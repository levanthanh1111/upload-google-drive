const express = require('express')
const app = express()
const {exec} = require('child_process')
const {authentication} = require("./authentication");

app.get('/',authentication, async function (req, res) {
    try {
        exec('sudo gitlab-backup create', (error, stdout) => {
            if (error) {
                return res.json({
                    code: 400,
                    message: "ERROR: " + error
                })
            }
            if (stdout) {
                console.log("BACKUP GITLAB ON UBUNTU")
                setTimeout(()=>{
                    console.log("MOVE FILE BACKUP FROM UBUNTU TO GOOGLE DRIVE")
                    exec('node serviceBackup.js', (error, stdout) => {
                        if(error){
                            return res.json({
                                code: 400,
                                message: error
                            })
                        }
                        if(stdout){
                            return res.json({
                                code: 200,
                                message: "BACKUP SUCCESS CHECK MAIL PLEASE!"
                            })
                        }
                    })
                },300000)
            }
        })
    }
    catch (error){
        return res.json({
            code: 404,
            message: "ERROR"
        })
    }
})

app.listen(4010, () =>{
    console.log("SERVER RUNNING PORT 4010")
})