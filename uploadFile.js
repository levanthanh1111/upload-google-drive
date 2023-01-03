require('dotenv').config();

const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

const { exec } = require("child_process");

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
    console.log(`success`);
});
const pathFile = path.join(__dirname, 'data-backup.tar.gz')
const time = new Date()
module.exports = {
    uploadFile: async () => {
        try {
            const createFile = await drive.files.create({
                requestBody:{
                    parents:['1K5ot1d0SkjsBU5unOEQ8dSpijRWw4RvI'],
                    name: `file-backup-${time.getDate()}thg${time.getMonth() + 1},${time.getFullYear()}-${time.getHours()}h${time.getMinutes()}m${time.getSeconds()}s.tar.gz`,
                    mimeType: 'application/gzip'
                },
                media: {
                    mimeType: 'application/gzip',
                    body: fs.createReadStream(pathFile)
                }
            })
            console.log(createFile.data)
        } catch (error) {
            console.error(error);
        }
    },
    deleteFile: async (fileId) => {
        try {
            const deleteFile = await drive.files.delete({
                fileId: fileId
            })
            console.log(deleteFile.data, deleteFile.status)
        } catch (error) {
            console.error(error);
        }
    }
};