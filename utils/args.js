import yargs from 'yargs';
const args = yargs
.option('file', {
    alias: 'f',
    string: true,
    default: "output.txt",
    describe: "output file name"
})
.option('mongodb', {
    alias: 'm',
    boolean: true,
    default: false,
    describe: 'choose to use local mongodb as default db'
})
.option('port', {
    alias: 'p',
    string: true,
    default: '27017',
    describe: "get port number"
})
.argv;

export default args;
