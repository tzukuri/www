import { argv } from 'yargs'
import Table from 'cli-table2'
import memoise from './memoise'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import chalk from 'chalk'
import * as fs from 'fs'
import * as path from 'path'
import * as contentful from 'contentful'


// Contentful
const spaceID               = 'l4uz4ntaje52'
const publishedAccessToken  = 'd3706d1f43fa9a20420079f4d8e1d3183d2c6535d790c6edbaf58297e215b23b'
const previewAccessToken    = '510b080cb03370d1d9966f86593b159a0a8b7e6ff845924a4c80d73d504ac70b'

// Filesystem
const publishedFolder       = 'published'
const previewFolder         = 'preview'
const syncTokenFile         = 'syncToken'
const fileEncoding          = 'utf8'

// Arguments
const publishedArg          = 'published'
const previewArg            = 'preview'


class ContentType {
    constructor(folder, accessToken) {
        this.folder = folder
        this.accessToken = accessToken
        this.rootFolder = path.join('.', 'data', folder)
        this.syncTokenPath = path.join(this.rootFolder, syncTokenFile)
        this.assetsFolder = path.join(this.rootFolder, 'assets')
        this.entriesFolder = path.join(this.rootFolder, 'entries')
    }

    @memoise
    get client() {
        return contentful.createClient({
            space: spaceID,
            accessToken: this.accessToken
        })
    }

    makeFolders() {
        mkdirp(this.assetsFolder)
        mkdirp(this.entriesFolder)
    }

    clean() {
        // lazily clean by deleting the entire root folder
        rimraf.sync(this.rootFolder)
    }

    syncParam() {
        if (fs.existsSync(this.syncTokenPath)) {
            let token = fs.readFileSync(this.syncTokenPath, {encoding: fileEncoding})
            return {nextSyncToken: token}
        } else {
            return {initial: true}
        }
    }

    writeObjects(folder, objects) {
        for (let obj of objects) {
            // use the entry/asset's ID as its filename
            let objPath = path.join(folder, `${obj.sys.id}.json`)

            // write the entry/asset out as pretty printed JSON
            let data = JSON.stringify(obj, null, '  ')
            fs.writeFileSync(objPath, data, fileEncoding)
        }
    }

    sync() {
        // ensure the required folders exist
        this.makeFolders()

        // attempt to perform an initial or updating sync
        console.log(chalk.green.bold(`\nStarting ${this.folder} sync\n`))
        return this.client.sync(this.syncParam()).then(response => {
            // the response object contains links that are functions,
            // may contain circular references etc. this method resolves
            // links to plain objects and prevent circular references.
            let plainResponse = response.toPlainObject()

            // write out new and updated content
            this.writeObjects(this.entriesFolder, plainResponse.entries)
            this.writeObjects(this.assetsFolder, plainResponse.assets)

            // store the sync token so the next time
            if (response.nextSyncToken) {
                fs.writeFileSync(
                    this.syncTokenPath,
                    response.nextSyncToken,
                    {encoding: fileEncoding}
                )
            }

            console.log(chalk.green.bold(`Finished sync\n`))
        })
    }
}


export const Content = {
    isPublished: (argv[publishedArg] != undefined || argv[previewArg] == undefined),
    isPreview:   (argv[previewArg] == undefined),

    published: new ContentType(publishedFolder, publishedAccessToken),
    preview:   new ContentType(previewFolder, previewAccessToken),

    @memoise
    get current() {
        return this.isPublished ? this.published : this.preview
    }
}
