let currentStep = 0;
let typingTimer = null;
let codePanelVisible = false;
let currentCodeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;
let HelloULineNumber = 9;
function updateCode() {
    if (window.matchMedia("(max-width: 700px)").matches) {
        currentCodeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
      content="width=device-width,
      initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;
        HelloULineNumber = 11;
    }
}

window.addEventListener('resize', updateCode);
updateCode();

let codeLines = currentCodeHTML.split('\n');
let lineNumbersArray = [];
for(let i=1; i<=codeLines.length; i++) lineNumbersArray.push(i);

function renderCodeLines() {
    const container = document.getElementById('codeTextContainer');
    if(!container) return;
    container.innerHTML = '';
    for(let i=0; i<codeLines.length; i++) {
        const lineDiv = document.createElement('div');
        lineDiv.style.fontFamily = 'Fira Code';
        lineDiv.className = 'code-line';
        lineDiv.textContent = codeLines[i];
        lineDiv.setAttribute('data-line', i+1);
        if(i+1 === HelloULineNumber) {
            lineDiv.style.backgroundColor = 'rgba(80, 160, 255, 0.15)';
            lineDiv.style.borderLeft = '3px solid #ffb347';
            lineDiv.style.paddingLeft = '4px';
        }
        container.appendChild(lineDiv);
    }
    const lineNumDiv = document.getElementById('lineNumbers');
    if(lineNumDiv) {
        lineNumDiv.innerHTML = '';
        for(let i=1; i<=codeLines.length; i++) {
            const numSpan = document.createElement('div');
            numSpan.textContent = i;
            lineNumDiv.appendChild(numSpan);
        }
    }
}

async function typeHelloU() {
    const codeContainer = document.getElementById('codeTextContainer');
    const targetLineDiv = codeContainer?.querySelector(`.code-line[data-line='9']`);
    const helloStr = '    Hello U!';
    for(let i=0; i<=helloStr.length; i++) {
        await delay(150);
        codeLines[HelloULineNumber-1] = helloStr.substring(0, i);
        renderCodeLines();
        if(targetLineDiv) targetLineDiv.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
    await delay(200);    
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function showExclamationAndEnter() {
    const promptSpan = document.querySelector('#initialCursorSpan');
    if(promptSpan){
        document.getElementById('startArrow').classList.add('hidden');
        document.getElementById('prompt').classList.add('hidden');
    } 
    promptSpan.innerHTML = '';
    const exclaimText = 'Hello U!';
    for(let i=0; i<=exclaimText.length; i++) {
        await delay(150);
        promptSpan.innerHTML = exclaimText.substring(0,i) + '<span class="cursor-blink"></span>';
    }
    let blinkCount = 0;
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            blinkCount++;
            if(blinkCount >= 2) {
                clearInterval(interval);
                resolve();
            }
        }, 700);
    });
}

function showCodeCardUI() {
    document.getElementById('initialPanel')?.classList.add('hidden');
    document.getElementById('codePanel')?.classList.remove('hidden');
    codeLines = currentCodeHTML.split('\n');
    renderCodeLines();
    setTimeout(() => {
        const lineDivs = document.querySelectorAll('.code-line');
    }, 200);
}

async function runLine9AnimationAndTransition() {
    const tipArea = document.getElementById('enterHintArea');
    await typeHelloU();
    await delay(1000);
    switchToWhiteWorld();
}

let quoteIndex = 0;


function switchToWhiteWorld() {
    const dynamicBgDiv = document.getElementById('dynamicBg');
    dynamicBgDiv.style.opacity = '0';
    dynamicBgDiv.style.transition = 'opacity 0.8s';
    document.body.classList.add('white-bg');
    document.body.style.backgroundColor = '#fffaf2';
    document.getElementById('codePanel')?.classList.add('hidden');
    const finalPanel = document.getElementById('finalPanel');
    finalPanel.classList.remove('hidden');
    quoteIndex = 0;
    updateQuoteText();
    setTimeout(() => {
        dynamicBgDiv.style.display = 'none';
    }, 800);
}

function updateQuoteText() {
    const quoteDiv = document.getElementById('dynamicQuote');
    if(quoteDiv) quoteDiv.textContent = quotesList[quoteIndex];
}

function nextQuote() {
    quoteIndex = (quoteIndex + 1) % quotesList.length;
    updateQuoteText();
    const btn = document.getElementById('nextQuoteBtn');
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => btn.style.transform = '', 150);
}

function prevQuote() {
    quoteIndex = (quoteIndex - 1 + quotesList.length) % quotesList.length;
    updateQuoteText();
    const btn = document.getElementById('prevQuoteBtn');
    btn.style.transform = 'scale(0.96)';
    setTimeout(() => btn.style.transform = '', 150);
}

async function onStartClick() {
    if(currentStep !== 0) return;
    currentStep = 1;
    const arrow = document.getElementById('startArrow');
    if(arrow) arrow.style.pointerEvents = 'none';
    await showExclamationAndEnter();
    currentStep = 2;
    showCodeCardUI();
    currentStep = 3;
    await runLine9AnimationAndTransition();
    currentStep = 4;
}

function initBlinkingCursor() {
    const cursorSpan = document.getElementById('initialCursorSpan');
    if(cursorSpan) {
        setInterval(() => {
            if(currentStep === 0 && cursorSpan && document.getElementById('initialPanel') && !document.getElementById('initialPanel').classList.contains('hidden')) {
            }
        }, 500);
    }
}

function bindEvents() {
    const startBtn = document.getElementById('startArrow');
    if(startBtn) startBtn.addEventListener('click', onStartClick);
    const nextBtn = document.getElementById('nextQuoteBtn');
    const prevBtn = document.getElementById('prevQuoteBtn');
    if(nextBtn) nextBtn.addEventListener('click', nextQuote);
    if(prevBtn) prevBtn.addEventListener('click', prevQuote);
}

window.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    initBlinkingCursor();
    document.getElementById('codePanel')?.classList.add('hidden');
    document.getElementById('finalPanel')?.classList.add('hidden');
    document.getElementById('initialPanel')?.classList.remove('hidden');
    currentStep = 0;
});