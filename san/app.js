// ⚡ Forge Mobile Engine State Core
let workspace = { ...initialWorkspace };
let activeFile = "src/main.luau";
let currentView = "editor"; // Options: 'explorer' | 'editor' | 'ai'
let terminalOpen = false;

// Preload mock AI history
let aiChatHistory = [
    { role: "assistant", text: "Hey Sun! I see your files. I can read your whole workspace layout at once. Need me to fix that Roblox script or write code?" }
];

const appContainer = document.getElementById("app");

// 🔄 RENDER VIEW CONTROLLER
function renderIDE() {
    appContainer.innerHTML = `
        <!-- 🟢 TOP HEADER BRANDING -->
        <header class="h-12 bg-panelBg border-b border-borderCol px-4 flex items-center justify-between z-10 shrink-0">
            <div class="flex items-center gap-2">
                <button onclick="switchView('explorer')" class="p-1 text-gray-400 active:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <span class="font-bold text-xs tracking-wider text-white">FORGE <span class="text-blue-400 text-[10px] bg-blue-500/10 px-1 py-0.5 rounded border border-blue-500/20">MOBILE v1</span></span>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="triggerQuickWand()" class="p-1.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 active:scale-95 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.34 18.65a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg>
                </button>
                <button onclick="runCodeCompiler()" class="flex items-center gap-1 text-[11px] px-3 py-1 rounded bg-emerald-600 text-white font-medium active:bg-emerald-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Run
                </button>
            </div>
        </header>

        <!-- 📱 MAIN VIEW WINDOWS CONTAINER -->
        <div class="flex-1 relative overflow-hidden">
            ${renderExplorerView()}
            ${renderEditorView()}
            ${renderAiView()}
        </div>

        <!-- 🎛️ LOWEST STACK COMPILER MONITOR -->
        ${renderTerminalWindow()}

        <!-- 🗺️ SCREEN CONSOLE CONTROLS NAVIGATION FOOTER -->
        <footer class="h-12 bg-panelBg border-t border-borderCol grid grid-cols-3 shrink-0">
            <button onclick="switchView('explorer')" class="flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-wider ${currentView === 'explorer' ? 'text-blue-400 bg-blue-500/5' : 'text-gray-400'}">
                <svg class="mb-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> Files
            </button>
            <button onclick="switchView('editor')" class="flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-wider ${currentView === 'editor' ? 'text-blue-400 bg-blue-500/5' : 'text-gray-400'}">
                <svg class="mb-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg> Editor
            </button>
            <button onclick="switchView('ai')" class="flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-wider ${currentView === 'ai' ? 'text-purple-400 bg-purple-500/5' : 'text-gray-400'}">
                <svg class="mb-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path><path d="M12 6v12"></path><path d="M6 12h12"></path></svg> AI Agent
            </button>
        </footer>
    `;
}

// --- SUB-VIEW RENDERING ENGINES ---

function renderExplorerView() {
    let fileRows = Object.keys(workspace).map(name => `
        <button onclick="selectFile('${name}')" class="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-mono text-left min-h-[44px] ${activeFile === name ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'active:bg-panelBg'}">
            <svg class="text-blue-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></button>
            <span class="truncate">${name}</span>
        </button>
    `).join('');

    return `
        <div class="absolute inset-0 bg-darkBg z-20 transform transition-transform duration-300 flex flex-col ${currentView === 'explorer' ? 'translate-x-0' : '-translate-x-full'}">
            <div class="p-4 border-b border-borderCol flex justify-between items-center bg-panelBg">
                <span class="text-xs uppercase font-bold tracking-wider text-gray-400">Workspace Explorer</span>
                <span onclick="switchView('editor')" class="text-xs text-blue-400 font-medium">Close</span>
            </div>
            <div class="flex-1 overflow-y-auto p-2 space-y-1">${fileRows}</div>
        </div>
    `;
}

function renderEditorView() {
    return `
        <div class="absolute inset-0 flex flex-col ${currentView === 'editor' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}">
            <!-- Tabs Bar Ribbon -->
            <div class="h-9 bg-panelBg border-b border-borderCol flex items-center px-2">
                <div class="bg-darkBg border-t-2 border-blue-500 text-white text-xs px-3 h-full flex items-center gap-2 border-r border-borderCol">
                    <span class="font-mono text-xs max-w-[150px] truncate">${activeFile}</span>
                </div>
            </div>
            <!-- Main Content Form Area -->
            <div class="flex-1 p-3 overflow-hidden">
                <textarea id="editorEngine" oninput="updateWorkspaceCode(this.value)" class="w-full h-full bg-transparent font-mono text-sm text-[#e6edf3] outline-none resize-none leading-relaxed whitespace-pre overflow-y-auto" autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck="false">${workspace[activeFile]}</textarea>
            </div>
            <!-- 🎹 KODER KEYBOARD SYMBOL ROW OVERLAY -->
            <div class="h-11 bg-panelBg border-t border-borderCol flex items-center px-1 gap-1 overflow-x-auto whitespace-nowrap no-scrollbar z-10 shrink-0">
                ${['\t', '{', '}', '[', ']', '(', ')', ';', '"', '<', '>', '=', '/', '_'].map(sym => `
                    <button onclick="injectSymbol('${sym}')" class="inline-block px-3.5 py-1.5 bg-[#21262d] active:bg-blue-600 active:text-white text-gray-200 font-mono text-sm rounded shadow-sm min-w-[38px] text-center">${sym === '\t' ? 'Tab' : sym}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAiView() {
    let messageBubbles = aiChatHistory.map(msg => `
        <div class="flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}">
            <div class="max-w-[85%] p-3 rounded-xl text-xs leading-relaxed border ${msg.role === 'user' ? 'bg-blue-600/10 text-blue-300 border-blue-500/20' : 'bg-[#21262d] text-gray-200 border-borderCol'}">
                <p class="whitespace-pre-wrap">${msg.text}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="absolute inset-0 bg-panelBg z-20 transform transition-transform duration-300 flex flex-col ${currentView === 'ai' ? 'translate-x-0' : 'translate-x-full'}">
            <div class="p-4 border-b border-borderCol flex justify-between items-center bg-darkBg">
                <span class="text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-1">✨ Global Agent Workspace</span>
                <span onclick="switchView('editor')" class="text-xs text-gray-400">Close</span>
            </div>
            <div id="aiChatTrack" class="flex-1 overflow-y-auto p-4 space-y-4 font-mono">${messageBubbles}</div>
            <div class="p-3 bg-darkBg border-t border-borderCol flex gap-2 shrink-0">
                <input id="aiInputField" type="text" placeholder="Ask agent to alter workspace code cleanly..." class="flex-1 bg-panelBg border border-borderCol rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-purple-500">
                <button onclick="submitAiPrompt()" class="px-3 rounded-lg bg-purple-600 text-white font-bold text-xs active:bg-purple-700">Send</button>
            </div>
        </div>
    `;
}

function renderTerminalWindow() {
    if (!terminalOpen) return '';
    return `
        <div class="h-36 bg-[#010409] border-t border-borderCol flex flex-col font-mono text-xs text-emerald-400 z-30 shrink-0">
            <div class="bg-panelBg px-3 py-1.5 flex justify-between items-center border-b border-borderCol text-gray-400">
                <span class="text-[10px] font-bold uppercase tracking-wider">Local Container Runtime</span>
                <span onclick="closeTerminal()" class="text-xs text-gray-500 font-bold px-1">X</span>
            </div>
            <div class="flex-1 p-2 overflow-y-auto space-y-1 select-text">
                <div>[system]: Verified file changes. Parsing AST structure tree.</div>
                <div>[runtime]: Running evaluation stack trace...</div>
                <div class="text-amber-400 font-semibold">⚠️ WARNING: Missing looping interval structure delay detected inside Luau action blocks. Thread safety compromised!</div>
            </div>
        </div>
    `;
}

// --- APP LOGIC INTERACTION CONTROLLERS ---

function switchView(viewName) {
    currentView = viewName;
    renderIDE();
    if(viewName === 'ai') scrollAiToBottom();
}

function selectFile(filename) {
    activeFile = filename;
    switchView('editor');
}

function updateWorkspaceCode(val) {
    workspace[activeFile] = val;
}

function injectSymbol(symbol) {
    const tx = document.getElementById("editorEngine");
    if (!tx) return;
    const start = tx.selectionStart;
    const end = tx.selectionEnd;
    const oldText = tx.value;
    
    tx.value = oldText.substring(0, start) + symbol + oldText.substring(end);
    workspace[activeFile] = tx.value;
    
    tx.focus();
    tx.setSelectionRange(start + symbol.length, start + symbol.length);
}

function runCodeCompiler() {
    terminalOpen = true;
    renderIDE();
}

function closeTerminal() {
    terminalOpen = false;
    renderIDE();
}

function triggerQuickWand() {
    switchView('ai');
    document.getElementById("aiInputField").value = `Optimize code logic inside ${activeFile} for safer threads.`;
}

function submitAiPrompt() {
    const input = document.getElementById("aiInputField");
    if (!input || !input.value.trim()) return;
    
    const promptText = input.value;
    aiChatHistory.push({ role: "user", text: promptText });
    renderIDE();
    scrollAiToBottom();
    
    // Simulate smart workspace editing logic (No full block rewrites)
    setTimeout(() => {
        if (promptText.toLowerCase().includes('fix') || promptText.toLowerCase().includes('optimize')) {
            // Target the error lines precisely inside the active workspace index [0:09:53]
            workspace["src/main.luau"] = workspace["src/main.luau"].replace(
                '-- ERROR TRIGGER AREA: Missing thread yield loop',
                'task.wait(0.1) -- 🛠️ Injected safety thread lock by Forge Agent V1'
            );
            aiChatHistory.push({ 
                role: "assistant", 
                text: `🛠️ Targeted patch successfully completed across repository files! I have isolated your main sequence logic blocks inside \`src/main.luau\` and surgically added a \`task.wait()\` throttle line to fix thread crashing.` 
            });
        } else {
            aiChatHistory.push({ 
                role: "assistant", 
                text: `Workspace verified. Let me know what operational features to deploy to your code stack next.` 
            });
        }
        renderIDE();
        scrollAiToBottom();
    }, 1000);
}

function scrollAiToBottom() {
    const chatTrack = document.getElementById("aiChatTrack");
    if (chatTrack) chatTrack.scrollTop = chatTrack.scrollHeight;
}

// 🎬 Bootstrap initialization entry loop
renderIDE();
