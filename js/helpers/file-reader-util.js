async function readFilesAsTextAsync(files) {
    const fileContents = [];
    for (const file of files) {
        const fileContent = await readFileAsTextAsync(file);
        fileContents.push(fileContent);
    }
    return fileContents;
}

async function readFileAsTextAsync(file) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
            fileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.readAsText(file);
    });
}
