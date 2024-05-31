import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import path from 'path'
import os from 'os'

// import { S3 } from "aws-sdk";
export async function downloadFromS3(file_key: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const s3 = new S3({
                region: "us-east-2",
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
                },
            });
            const params = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
                Key: file_key,
            };

            const obj = await s3.getObject(params);
            // Get the OS-specific temporary directory
            const tempDir = os.tmpdir();

            // Create a directory for your PDF files
            const dir = path.join(tempDir);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const file_name = `ahmedzubairu${Date.now().toString()}.pdf`;
            const file_path = path.join(tempDir, file_name )
                console.log(file_path + 'this is the file path')

            if (obj.Body instanceof require("stream").Readable) {
                //   fs.writeFileSync(file_name, obj.Body  )
                // AWS-SDK v3 has some issues with their typescript definitions, but this works
                // https://github.com/aws/aws-sdk-js-v3/issues/843
                //open the writable stream and write the file
                const file = fs.createWriteStream(file_path);
                file.on("open", function (fd) {
                    // @ts-ignore
                    obj.Body?.pipe(file).on("finish", () => {
                        return resolve(file_path);
                    });
                });
                // obj.Body?.pipe(fs.createWriteStream(file_name));
            }
        } catch (error) {
            console.error(error);
            reject(error);
            return null;
        }
    });
}

// downloadFromS3("uploads/1693568801787chongzhisheng_resume.pdf");