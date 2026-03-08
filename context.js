function getProblemDescription() {

    const elements = document.querySelectorAll(".elfjS");

    if (!elements || elements.length === 0) {
        return "";
    }

    let description = "";

    elements.forEach(el => {
        description += el.innerText + "\n\n";
    });

    return description.trim();
}

function getCurrentCode() {
    const codeBlocks = document.querySelectorAll(".view-line");
    let code = "";

    codeBlocks.forEach(block => {
        code += block.innerText + "\n";
    });

    return code.trim();
}