// script to replace default 'Solidity API' title of markdown files produced by solidity docgen to the corresponding contract name

const fs = require("fs");

fs.readdirSync("./docs").forEach(dir => {
    // if it's a directory, go in and replace title 
    if (fs.existsSync("./docs/" + dir) && fs.lstatSync("./docs/" + dir).isDirectory()) {
        fs.readdirSync("./docs/" + dir).forEach(file => {
            fs.readFile('./docs/' + dir +'/'+ file , "utf8", function(err, data) {
              if (err) {
                  return console.log(err);
              } 
                var replaceTitle = data.replace(/# Solidity API\s*#/, '');
            
                fs.writeFile('./docs/' + dir + '/' + file, replaceTitle, 'utf8', function (err) {
                   if (err) return console.log(err);
                });
            });
        })
    }
})