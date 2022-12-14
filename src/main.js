import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import path from 'path'
import { promisify } from 'util'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'
import { execa } from 'execa'

const access = promisify(fs.access)
const copy = promisify(ncp)

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    })
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    })
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'))
    }
    return
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    }

    const templateDir = path.resolve(__filename, '../../templates', options.template.toLowerCase())
    options.templateDirectory = templateDir

    try {
        await access(templateDir, fs.constants.R_OK)
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'))
        process.exit(1)
    }
    const tasks = new Listr([
        {
            title: 'Copy Project Files',
            task: () => copyTemplateFiles(options),
        },
        {
            title: 'Install dependencies',
            task: () =>
                projectInstall({
                    cwd: options.targetDirectory,
                    prefer: options.packageManager.toLowerCase(),
                }),
        },
    ])

    await tasks.run()

    options.packageManager.toLowerCase() === 'npm' ? npmBuildScripts(options) : yarnBuildScripts(options)

    return true
}

function npmBuildScripts(options) {
    console.log('%s Project ready', chalk.green.bold('DONE'))
    console.log(`Success! Created Project at ${options.targetDirectory}`)
    console.log(`${chalk.cyan('You can run several commands: ')}`)

    console.log(`
  ${chalk.cyan('npm run dev')}
    Starts the development server.

  ${chalk.cyan('npm run build')}
    Bundles the app into static files for production.
  `)
}

function yarnBuildScripts(options) {
    console.log('%s Project ready', chalk.green.bold('DONE'))
    console.log(`Success! Created Project at ${options.targetDirectory}`)
    console.log(`${chalk.cyan('You can run several commands: ')}`)

    console.log(`
  ${chalk.cyan('yarn dev')}
    Starts the development server.

  ${chalk.cyan('yarn run build')}
    Bundles the app into static files for production.
  `)
}
