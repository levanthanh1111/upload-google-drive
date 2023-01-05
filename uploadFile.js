require('dotenv').config();

const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

const { exec } = require("child_process");
const {sendMailGitlab} = require("./sendMail");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

exec("tar -zcf data-backup.tar.gz data-backup", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`compress folder success`);
});

async function deleteFile(fileId) {
    try {
        const deleteFile = await drive.files.delete({
            fileId: fileId
        })
        console.log("status delete folder backup old: ",deleteFile.status)
    } catch (error) {
        console.error(error);
    }
}

const pathFile = path.join(__dirname, 'data-backup.tar.gz');
const time = new Date();
module.exports = {
    uploadFile: async () => {
        try {
            const createFile = await drive.files.create({
                requestBody: {
                    parents: ['1K5ot1d0SkjsBU5unOEQ8dSpijRWw4RvI'],
                    name: `file-backup-${time.getDate()}thg${time.getMonth() + 1},${time.getFullYear()}-${time.getHours()}h${time.getMinutes()}m${time.getSeconds()}s.tar.gz`,
                    mimeType: 'application/gzip'
                },
                media: {
                    mimeType: 'application/gzip',
                    body: fs.createReadStream(pathFile)
                }
            })
            if(createFile.status === 200) {
                await sendMailGitlab("thanh0967669406@gmail.com", `Gitlab backup SUCCESS Time: ${time.getDate()}thg${time.getMonth() + 1},${time.getFullYear()}-${time.getHours()}h${time.getMinutes()}m${time.getSeconds()}s`)
            } else {
                await sendMailGitlab("thanh0967669406@gmail.com", `Gitlab backup FAIL Time: ${time.getDate()}thg${time.getMonth() + 1},${time.getFullYear()}-${time.getHours()}h${time.getMinutes()}m${time.getSeconds()}s`)
            }
        } catch (error) {
            await sendMailGitlab("thanh0967669406@gmail.com", `Gitlab backup FAIL Time: ${time.getDate()}thg${time.getMonth() + 1},${time.getFullYear()}-${time.getHours()}h${time.getMinutes()}m${time.getSeconds()}s`)
            console.error(error);
        }
    },
    getFile: async(ID_OF_THE_FOLDER) => {
        try {
            const getFile = await drive.files.list({
                q: `'${ID_OF_THE_FOLDER}' in parents and trashed=false`
            })
            if(getFile.data.files.length >= 3) {
                for (let i = 3; i < getFile.data.files.length; i++) {
                    if (i >= 3) {
                         await deleteFile(getFile.data.files[i]['id'])
                    }
                }
            }
        }  catch (error) {
            console.error(error)
        }
    }
};