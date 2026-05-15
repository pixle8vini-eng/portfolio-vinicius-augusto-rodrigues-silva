import './index.css';
import { marked } from 'marked';

const DEFAULT_MARKDOWN = `# Welcome to StackEdit Clone!

Hi! I'm your first Markdown file in **StackEdit Clone**. 

## What is Markdown?

Markdown is a lightweight markup language with plain-text-formatting syntax. Its design allows it to be converted to many output formats, but the name as originally used referred to the tool itself, which was written in Perl.

### Features:
- **Real-time preview**
- **Local storage** (your files are saved in your browser)
- **GitHub Flavored Markdown** support
- **Clean UI** inspired by StackEdit

## Files
StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Create files and folders
The file explorer is accessible using the button in the left corner of the navigation bar. You can create a new file by clicking the **New file** button.

\`\`\`javascript
function helloWorld() {
  console.log("Hello from StackEdit Clone!");
}
\`\`\`

> "Markdown is intended to be as easy-to-read and easy-to-write as is feasible."
> — John Gruber

Enjoy writing!
`;

// State
let files = JSON.parse(localStorage.getItem('stackedit_files')) || [
    { id: 'welcome', name: 'Welcome file', content: DEFAULT_MARKDOWN, updatedAt: Date.now() }
];
let currentFileId = localStorage.getItem('stackedit_current_file_id') || 'welcome';
let isSidebarOpen = false;

// DOM Elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const fileList = document.getElementById('fileList');
const fileNameInput = document.getElementById('fileNameInput');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const newFileBtn = document.getElementById('newFile');
const fileCount = document.getElementById('fileCount');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const downloadBtn = document.getElementById('downloadBtn');
const toolbar = document.getElementById('toolbar');

const viewEditorBtn = document.getElementById('viewEditor');
const viewSplitBtn = document.getElementById('viewSplit');
const viewPreviewBtn = document.getElementById('viewPreview');
const editorPane = document.getElementById('editorPane');
const previewPane = document.getElementById('previewPane');

// Initialize
function init() {
    renderFileList();
    loadCurrentFile();
    setupToolbar();
    setupEventListeners();
    updateCounts();
    lucide.createIcons();
}

function loadCurrentFile() {
    const file = files.find(f => f.id === currentFileId) || files[0];
    currentFileId = file.id;
    editor.value = file.content;
    fileNameInput.value = file.name;
    renderMarkdown();
    updateCounts();
}

function renderMarkdown() {
    preview.innerHTML = marked.parse(editor.value);
}

function updateCounts() {
    const text = editor.value.trim();
    const words = text === '' ? 0 : text.split(/\s+/).length;
    wordCount.textContent = `Words: ${words}`;
    charCount.textContent = `Characters: ${editor.value.length}`;
}

function saveToLocalStorage() {
    localStorage.setItem('stackedit_files', JSON.stringify(files));
    localStorage.setItem('stackedit_current_file_id', currentFileId);
}

function renderFileList() {
    fileList.innerHTML = '';
    files.forEach(file => {
        const div = document.createElement('div');
        div.className = `group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${file.id === currentFileId ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`;
        div.onclick = () => {
            currentFileId = file.id;
            loadCurrentFile();
            toggleSidebar(false);
            renderFileList();
        };

        const left = document.createElement('div');
        left.className = 'flex items-center gap-3 overflow-hidden';
        left.innerHTML = `<i data-lucide="file-text" size="18" class="${file.id === currentFileId ? 'text-blue-500' : 'text-gray-400'}"></i><span class="truncate font-medium text-sm">${file.name}</span>`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all';
        deleteBtn.innerHTML = '<i data-lucide="trash-2" size="14"></i>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (files.length <= 1) return;
            files = files.filter(f => f.id !== file.id);
            if (currentFileId === file.id) {
                currentFileId = files[0].id;
                loadCurrentFile();
            }
            renderFileList();
            saveToLocalStorage();
            lucide.createIcons();
        };

        div.appendChild(left);
        div.appendChild(deleteBtn);
        fileList.appendChild(div);
    });
    fileCount.textContent = `${files.length} files`;
    lucide.createIcons();
}

function toggleSidebar(force) {
    isSidebarOpen = force !== undefined ? force : !isSidebarOpen;
    if (isSidebarOpen) {
        sidebar.classList.remove('-translate-x-full');
    } else {
        sidebar.classList.add('-translate-x-full');
    }
}

function setupToolbar() {
    const actions = [
        { icon: 'bold', before: '**', after: '**', label: 'Bold' },
        { icon: 'italic', before: '*', after: '*', label: 'Italic' },
        { icon: 'heading-1', before: '# ', after: '', label: 'H1' },
        { icon: 'heading-2', before: '## ', after: '', label: 'H2' },
        { icon: 'list', before: '- ', after: '', label: 'List' },
        { icon: 'link', before: '[', after: '](url)', label: 'Link' },
        { icon: 'image', before: '![alt](', after: ')', label: 'Image' },
        { icon: 'code', before: '`', after: '`', label: 'Code' },
        { icon: 'quote', before: '> ', after: '', label: 'Quote' },
    ];

    actions.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-300 hover:text-white';
        btn.title = item.label;
        btn.innerHTML = `<i data-lucide="${item.icon}" size="18"></i>`;
        btn.onclick = () => insertText(item.before, item.after);
        toolbar.appendChild(btn);
    });
}

function insertText(before, after) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    editor.value = newText;
    updateContent(newText);
    renderMarkdown();
    
    editor.focus();
    editor.setSelectionRange(start + before.length, end + before.length);
}

function updateContent(newContent) {
    files = files.map(f => f.id === currentFileId ? { ...f, content: newContent, updatedAt: Date.now() } : f);
    saveToLocalStorage();
    updateCounts();
}

function setupEventListeners() {
    editor.oninput = (e) => {
        updateContent(e.target.value);
        renderMarkdown();
    };

    fileNameInput.oninput = (e) => {
        files = files.map(f => f.id === currentFileId ? { ...f, name: e.target.value } : f);
        saveToLocalStorage();
        renderFileList();
    };

    toggleSidebarBtn.onclick = () => toggleSidebar();

    newFileBtn.onclick = () => {
        const newFile = {
            id: Math.random().toString(36).substring(7),
            name: 'Untitled.md',
            content: '# New File\n\nStart writing...',
            updatedAt: Date.now()
        };
        files.unshift(newFile);
        currentFileId = newFile.id;
        loadCurrentFile();
        renderFileList();
        saveToLocalStorage();
        toggleSidebar(false);
    };

    downloadBtn.onclick = () => {
        const file = files.find(f => f.id === currentFileId);
        const element = document.createElement("a");
        const blob = new Blob([file.content], {type: 'text/markdown'});
        element.href = URL.createObjectURL(blob);
        element.download = `${file.name.endsWith('.md') ? file.name : file.name + '.md'}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    viewEditorBtn.onclick = () => setView('editor');
    viewSplitBtn.onclick = () => setView('split');
    viewPreviewBtn.onclick = () => setView('preview');
}

function setView(mode) {
    const btns = [viewEditorBtn, viewSplitBtn, viewPreviewBtn];
    btns.forEach(b => {
        b.classList.remove('bg-white/20', 'text-white');
        b.classList.add('text-gray-400');
    });

    if (mode === 'editor') {
        viewEditorBtn.classList.add('bg-white/20', 'text-white');
        editorPane.className = 'flex flex-col h-full bg-[#f8f9fa] w-full transition-all duration-300';
        previewPane.classList.add('hidden');
    } else if (mode === 'split') {
        viewSplitBtn.classList.add('bg-white/20', 'text-white');
        editorPane.className = 'flex flex-col h-full bg-[#f8f9fa] w-1/2 border-r border-gray-200 transition-all duration-300';
        previewPane.className = 'flex flex-col h-full bg-white overflow-y-auto w-1/2 transition-all duration-300';
    } else if (mode === 'preview') {
        viewPreviewBtn.classList.add('bg-white/20', 'text-white');
        editorPane.classList.add('hidden');
        previewPane.className = 'flex flex-col h-full bg-white overflow-y-auto w-full transition-all duration-300';
    }
}

init();
