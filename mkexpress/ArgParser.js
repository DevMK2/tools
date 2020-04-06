const process = require('process');

const ArgParser = function() {
  this.DefaultPackName = "test_server";

  this.TDD = false;
  this.PORT = 3000;
  this.PackName = this.DefaultPackName;
}

ArgParser.prototype.Run = function() {
  this.parseArgs();
  this.printArgs();
}

ArgParser.prototype.parseArgs = function() {
  let argv = process.argv;
  const that = this;
  
  //\ Parse args starts with '--'
  argv = argv.filter(
    arg=>arg.startsWith('--')? parseOptions(arg.substr(2)) : true
  );

  //\ Parse package name arg
  if(argv.length == 2)
    console.log("there's no package name");
  else
    this.PackName = argv[2];


  function parseOptions(option) {
    const isTDD = ()=>option.startsWith('tdd')
        , isPort = ()=> option.startsWith('port')
                     || option.startsWith('Port')
                     || option.startsWith('PORT');

    if(isTDD()) parseTDD();
    if(isPort()) parsePort(option);
  };

  function parseTDD() {
    that.TDD = true;
  }

  function parsePort(option) {
    let port = Number(option.split('=')[1])
    if(Number.isInteger(port) && port>=1000 && port<9000)
      that.PORT = port;
    else
      console.error("Port number isn't valid");
  }
};

ArgParser.prototype.printArgs = function() {
  console.log();
  console.log(`Create '${this.PackName}' server!`);
  console.log('Port Number : ', this.PORT);
  console.log('unit test : ', this.TDD);
  console.log();
};

function GetArguments() {
  let arguments = new ArgParser();
  arguments.Run();

  return arguments;
}

module.exports = {ArgParser, GetArguments};
