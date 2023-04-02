#!/usr/bin/env node

const { CLI } = require('@codedungeon/gunner')
const colors = require('chalk')
const parseArgs = require('minimist')

const pkgInfo = require('./package.json')

const getLogDirectory = (argv, defaultLocation = 'system') => {
  const logDir = parseArgs(argv)['logDir'] || parseArgs(argv)['log-dir'] || ''
  return logDir.length > 0 ? logDir : defaultLocation
}

new CLI(process.argv, __dirname)
  .usage(`${pkgInfo.packageName} ${colors.magenta('<resource>')} ${colors.cyan('[options]')}`)
  .options()
  .version(/* version string override, if not supplied default version info will be displayed */)
  .examples(
    /* if not called, examples will be suppressed in help dialog */
    [
      `noteplan-cli plugin:create ${colors.gray('(creates noteplan plugin project)')}`,
      `  noteplan-cli plugin:dev codedungeon.Toolbox -wcn ${colors.gray('(plugin development watch, compact and notify)')}`,
      `  noteplan-cli plugin:test codedungeon.Toolbox -ws ${colors.gray('(plugin testing watch, silent)')}`,
    ].join('\n'),
  )
  .logger({ directory: getLogDirectory(process.argv), alwaysLog: true })
  .hooks({
    beforeExecute: (toolbox, command = '', args = {}) => {
      toolbox.print.write('debug', {
        hook: 'beforeExecute',
        command,
        args,
        cwd: process.cwd(),
      })
    },
    afterExecute: (toolbox, command = '', args = {}) => {
      toolbox.print.write('debug', { hook: 'afterExecute', command, args })
    },
    commandPrefix: 'make:',
  })
  .run()
