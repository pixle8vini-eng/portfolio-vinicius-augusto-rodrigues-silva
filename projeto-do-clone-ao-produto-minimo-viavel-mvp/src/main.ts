import './index.css';
import { marked } from 'marked';
import { 
    auth, db, storage, googleProvider, signInWithPopup, signOut, onAuthStateChanged, 
    collection, doc, setDoc, getDoc, onSnapshot, query, where, orderBy, deleteDoc,
    ref, uploadBytes, getDownloadURL
} from './firebase';

const DEFAULT_MARKDOWN = `# Welcome to Blue Markdown Generator!

Hi! I'm your first Markdown file in **Blue Markdown Generator**. 

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

interface FileData {
    id: string;
    uid: string;
    name: string;
    content: string;
    updatedAt: number;
}

// State
let files: FileData[] = JSON.parse(localStorage.getItem('stackedit_files') || '[]') || [
    { id: 'welcome', uid: 'local', name: 'Welcome file', content: DEFAULT_MARKDOWN, updatedAt: Date.now() }
];
if (files.length === 0) {
    files = [{ id: 'welcome', uid: 'local', name: 'Welcome file', content: DEFAULT_MARKDOWN, updatedAt: Date.now() }];
}

let currentFileId = localStorage.getItem('stackedit_current_file_id') || 'welcome';
let isSidebarOpen = false;
let currentUser: any = null;
let unsubscribeFiles: (() => void) | null = null;

// DOM Elements
const editor = document.getElementById('editor') as HTMLTextAreaElement;
const preview = document.getElementById('preview') as HTMLDivElement;
const fileList = document.getElementById('fileList') as HTMLDivElement;
const fileNameInput = document.getElementById('fileNameInput') as HTMLInputElement;
const toggleSidebarBtn = document.getElementById('toggleSidebar') as HTMLButtonElement;
const sidebar = document.getElementById('sidebar') as HTMLElement;
const newFileBtn = document.getElementById('newFile') as HTMLButtonElement;
const fileCount = document.getElementById('fileCount') as HTMLSpanElement;
const wordCount = document.getElementById('wordCount') as HTMLSpanElement;
const charCount = document.getElementById('charCount') as HTMLSpanElement;
const toolbar = document.getElementById('toolbar') as HTMLDivElement;

const viewEditorBtn = document.getElementById('viewEditor') as HTMLButtonElement;
const viewSplitBtn = document.getElementById('viewSplit') as HTMLButtonElement;
const viewPreviewBtn = document.getElementById('viewPreview') as HTMLButtonElement;
const editorPane = document.getElementById('editorPane') as HTMLDivElement;
const previewPane = document.getElementById('previewPane') as HTMLDivElement;

const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
const userProfile = document.getElementById('userProfile') as HTMLDivElement;
const userAvatar = document.getElementById('userAvatar') as HTMLImageElement;
const userName = document.getElementById('userName') as HTMLSpanElement;

const importBtn = document.getElementById('importBtn') as HTMLButtonElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const imageInput = document.getElementById('imageInput') as HTMLInputElement;
const downloadMenuBtn = document.getElementById('downloadMenuBtn') as HTMLButtonElement;
const downloadMenu = document.getElementById('downloadMenu') as HTMLDivElement;

// Initialize
function init() {
    renderFileList();
    loadCurrentFile();
    setupToolbar();
    setupEventListeners();
    updateCounts();
    // @ts-ignore
    lucide.createIcons();
    
    // Auth Listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loginBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');
            userAvatar.src = user.photoURL || '';
            userName.textContent = user.displayName || user.email;
            
            // Sync user profile to Firestore
            setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString()
            }, { merge: true });

            subscribeToFiles(user.uid);
        } else {
            currentUser = null;
            loginBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
            if (unsubscribeFiles) {
                unsubscribeFiles();
                unsubscribeFiles = null;
            }
            renderFileList();
        }
    });
}

function subscribeToFiles(uid: string) {
    if (unsubscribeFiles) unsubscribeFiles();
    
    const q = query(collection(db, 'files'), where('uid', '==', uid), orderBy('updatedAt', 'desc'));
    unsubscribeFiles = onSnapshot(q, (snapshot) => {
        const remoteFiles: FileData[] = [];
        snapshot.forEach((doc) => {
            remoteFiles.push(doc.data() as FileData);
        });
        
        if (remoteFiles.length > 0) {
            files = remoteFiles;
            if (!files.find(f => f.id === currentFileId)) {
                currentFileId = files[0].id;
            }
            renderFileList();
            loadCurrentFile();
            saveToLocalStorage();
        }
    }, (error) => {
        console.error("Error fetching files:", error);
    });
}

function loadCurrentFile() {
    const file = files.find(f => f.id === currentFileId) || files[0];
    if (!file) return;
    currentFileId = file.id;
    editor.value = file.content;
    fileNameInput.value = file.name;
    renderMarkdown();
    updateCounts();
}

async function renderMarkdown() {
    preview.innerHTML = await marked.parse(editor.value);
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

async function saveFileToFirestore(file: FileData) {
    if (!currentUser) return;
    try {
        await setDoc(doc(db, 'files', file.id), { ...file, uid: currentUser.uid });
    } catch (error) {
        console.error("Error saving file to Firestore:", error);
    }
}

function renderFileList() {
    fileList.innerHTML = '';
    files.forEach(file => {
        const div = document.createElement('div');
        div.className = `group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${file.id === currentFileId ? 'bg-white/10 text-white border border-white/10' : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'}`;
        div.onclick = () => {
            currentFileId = file.id;
            loadCurrentFile();
            toggleSidebar(false);
            renderFileList();
        };

        const left = document.createElement('div');
        left.className = 'flex items-center gap-3 overflow-hidden';
        left.innerHTML = `<i data-lucide="file-text" size="16" class="${file.id === currentFileId ? 'text-white' : 'text-gray-600'}"></i><span class="truncate text-[11px] uppercase tracking-widest font-bold">${file.name}</span>`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 hover:text-white rounded-full transition-all text-gray-600';
        deleteBtn.innerHTML = '<i data-lucide="trash-2" size="14"></i>';
        deleteBtn.onclick = async (e) => {
            e.stopPropagation();
            if (files.length <= 1) return;
            
            if (currentUser) {
                try {
                    await deleteDoc(doc(db, 'files', file.id));
                } catch (error) {
                    console.error("Error deleting file:", error);
                }
            }

            files = files.filter(f => f.id !== file.id);
            if (currentFileId === file.id) {
                currentFileId = files[0].id;
                loadCurrentFile();
            }
            renderFileList();
            saveToLocalStorage();
            // @ts-ignore
            lucide.createIcons();
        };

        div.appendChild(left);
        div.appendChild(deleteBtn);
        fileList.appendChild(div);
    });
    fileCount.textContent = `${files.length} files`;
    // @ts-ignore
    lucide.createIcons();
}

function toggleSidebar(force?: boolean) {
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
        { icon: 'image', before: '![alt](', after: ')', label: 'Image', special: 'image' },
        { icon: 'code', before: '`', after: '`', label: 'Code' },
        { icon: 'quote', before: '> ', after: '', label: 'Quote' },
    ];

    toolbar.innerHTML = '';
    actions.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-300 hover:text-white';
        btn.title = item.label;
        btn.innerHTML = `<i data-lucide="${item.icon}" size="18"></i>`;
        btn.onclick = () => {
            if (item.special === 'image') {
                imageInput.click();
            } else {
                insertText(item.before, item.after);
            }
        };
        toolbar.appendChild(btn);
    });
}

function insertText(before: string, after: string) {
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

function updateContent(newContent: string) {
    const file = files.find(f => f.id === currentFileId);
    if (file) {
        file.content = newContent;
        file.updatedAt = Date.now();
        saveToLocalStorage();
        updateCounts();
        saveFileToFirestore(file);
    }
}

function setupEventListeners() {
    editor.oninput = (e: any) => {
        updateContent(e.target.value);
        renderMarkdown();
    };

    fileNameInput.oninput = (e: any) => {
        const file = files.find(f => f.id === currentFileId);
        if (file) {
            file.name = e.target.value;
            saveToLocalStorage();
            renderFileList();
            saveFileToFirestore(file);
        }
    };

    toggleSidebarBtn.onclick = () => toggleSidebar();

    newFileBtn.onclick = () => {
        const newFile: FileData = {
            id: Math.random().toString(36).substring(7),
            uid: currentUser ? currentUser.uid : 'local',
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
        saveFileToFirestore(newFile);
    };

    importBtn.onclick = () => fileInput.click();

    fileInput.onchange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: any) => {
            const content = event.target.result;
            const newFile: FileData = {
                id: Math.random().toString(36).substring(7),
                uid: currentUser ? currentUser.uid : 'local',
                name: file.name,
                content: content,
                updatedAt: Date.now()
            };
            files.unshift(newFile);
            currentFileId = newFile.id;
            loadCurrentFile();
            renderFileList();
            saveToLocalStorage();
            saveFileToFirestore(newFile);
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    imageInput.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file || !currentUser) {
            if (!currentUser) alert("Please login to upload images to Cloud Storage.");
            return;
        }

        try {
            const storageRef = ref(storage, `users/${currentUser.uid}/assets/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            insertText(`![${file.name}](${downloadURL})`, '');
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image. Check console for details.");
        }
        e.target.value = ''; // Reset input
    };

    downloadMenuBtn.onclick = (e) => {
        e.stopPropagation();
        downloadMenu.classList.toggle('hidden');
    };

    window.onclick = () => {
        downloadMenu.classList.add('hidden');
    };

    downloadMenu.onclick = async (e: any) => {
        const format = e.target.getAttribute('data-format');
        if (!format) return;

        const file = files.find(f => f.id === currentFileId);
        if (!file) return;

        let content = file.content;
        let mimeType = 'text/markdown';
        let extension = 'md';

        if (format === 'html') {
            content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${file.name}</title><style>body{font-family:sans-serif;padding:2rem;max-width:800px;margin:0 auto;line-height:1.6;}</style></head><body>${await marked.parse(file.content)}</body></html>`;
            mimeType = 'text/html';
            extension = 'html';
        } else if (format === 'txt') {
            mimeType = 'text/plain';
            extension = 'txt';
        }

        const element = document.createElement("a");
        const blob = new Blob([content], {type: mimeType});
        element.href = URL.createObjectURL(blob);
        element.download = `${file.name.split('.')[0]}.${extension}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    viewEditorBtn.onclick = () => setView('editor');
    viewSplitBtn.onclick = () => setView('split');
    viewPreviewBtn.onclick = () => setView('preview');

    loginBtn.onclick = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    logoutBtn.onclick = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
}

function setView(mode: 'editor' | 'split' | 'preview') {
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
