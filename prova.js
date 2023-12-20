const createDelay = require("./src/functions/createDelay");

function recursiveFunction(index, finalindex, results = []) {
    return new Promise((resolve) => {

        // Simulazione di un'operazione asincrona
        setTimeout(() => {
            const output = `Output: ${index}`;
            
            console.log(output);
            results.push(output);

            if (index < finalindex) recursiveFunction((index + 1), finalindex, results).then(() => resolve(results)); // Avvia la ricorsione e attendi la sua risoluzione
            else resolve(results); // Risolve la Promise con i risultati accumulati

        }, createDelay(2, 7));

    });
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

recursiveFunction(0, (arr.length - 1)).then((finalOutput) => {
    console.log('Risultato finale:', finalOutput);
});