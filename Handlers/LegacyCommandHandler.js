function loadLegacyCommands(client) {
    const ascii = require("ascii-table");
    const fs = require("fs");
    const table = new ascii().setHeading("Legacy Commands", "Status");
  
    const commandFolders = fs.readdirSync("./LegacyCommands")
    for (const folder of commandFolders) {
        const commandFile = fs.readdirSync(`./LegacyCommands/${folder}`).filter(files => files.endsWith(".js"))
        for (const file of commandFile) {
            const command = require(`../LegacyCommands/${folder}/${file}`)
            client.legacyCommands.set(command.name, command)

            table.addRow(file, "loaded")
            continue;
        }
    }

    return console.log(table.toString(), "\n Loaded Legacy Commands");
}

module.exports = { loadLegacyCommands };