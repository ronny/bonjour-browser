const createBonjour = require('bonjour')
const Table = require('cli-table2')
const clear = require('clear')

const { type } = require('yargs')
  .usage('$0 <cmd> [args]')
  .option('type', {
    alias: 't',
    describe: 'service type, e.g. ipp, http, ssh — defaults to everything',
  })
  .help()
  .argv

const FIELDS = [
  'host',
  'addresses',
  'type',
  'port',
  'protocol',
]


const up = {}

function updateTable() {
  clear()
  const table = new Table({
    head: FIELDS,
  })
  Object.keys(up).forEach((key) => {
    table.push(up[key])
  })
  console.log(table.toString()) // eslint-disable-line no-console
}

const bonjour = createBonjour()
const browser = bonjour.find({ type })
browser.on('up', (service) => {
  up[service.fqdn] = FIELDS.map(field => service[field])
  updateTable()
})
browser.on('down', (service) => {
  delete up[service.fqdn]
  updateTable()
})

