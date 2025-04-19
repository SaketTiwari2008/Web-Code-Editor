const htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
  mode: "text/html",
  lineNumbers: true,
  autoCloseTags: true,
  autoCloseBrackets: true,
  theme: "dracula",
  tabSize: 2,
  indentUnit: 2,
  matchBrackets: true,
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById("cssEditor"), {
  mode: "css",
  lineNumbers: true,
  autoCloseBrackets: true,
  theme: "dracula",
  tabSize: 2,
  indentUnit: 2,
  matchBrackets: true,
});

const jsEditor = CodeMirror.fromTextArea(document.getElementById("jsEditor"), {
  mode: "javascript",
  lineNumbers: true,
  autoCloseBrackets: true,
  theme: "dracula",
  tabSize: 2,
  indentUnit: 2,
  matchBrackets: true,
});

const previewFrame = document.getElementById("preview");
const fileSelect = document.getElementById("fileSelect");
const newFileBtn = document.getElementById("newFileBtn");
const saveFileBtn = document.getElementById("saveFileBtn");
const deleteFileBtn = document.getElementById("deleteFileBtn");
const runBtn = document.getElementById("runBtn");
const themeSelect = document.getElementById("themeSelect");

let currentFileName = null;

function updatePreview() {
  const html = htmlEditor.getValue();
  const css = "<style>" + cssEditor.getValue() + "</style>";
  const js = "<script>" + jsEditor.getValue() + "<\/script>";
  const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  previewDoc.open();
  previewDoc.write(html + css + js);
  previewDoc.close();
}

function saveFile() {
  if (!currentFileName) {
    const name = prompt("Enter file name to save:");
    if (!name) return;
    currentFileName = name;
  }
  const fileData = {
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue(),
  };
  localStorage.setItem("webcodeeditor-file-" + currentFileName, JSON.stringify(fileData));
  alert("File saved: " + currentFileName);
  loadFileList();
  fileSelect.value = currentFileName;
}

function loadFileList() {
  fileSelect.innerHTML = "";
  const keys = Object.keys(localStorage).filter(k => k.startsWith("webcodeeditor-file-"));
  keys.forEach(key => {
    const fileName = key.replace("webcodeeditor-file-", "");
    const option = document.createElement("option");
    option.value = fileName;
    option.textContent = fileName;
    fileSelect.appendChild(option);
  });
}

function loadFile(name) {
  const data = localStorage.getItem("webcodeeditor-file-" + name);
  if (!data) return;
  const fileData = JSON.parse(data);
  htmlEditor.setValue(fileData.html);
  cssEditor.setValue(fileData.css);
  jsEditor.setValue(fileData.js);
  currentFileName = name;
  updatePreview();
}

function deleteFile() {
  if (!currentFileName) {
    alert("No file selected to delete.");
    return;
  }
  if (confirm("Are you sure you want to delete file: " + currentFileName + "?")) {
    localStorage.removeItem("webcodeeditor-file-" + currentFileName);
    alert("File deleted: " + currentFileName);
    currentFileName = null;
    htmlEditor.setValue("");
    cssEditor.setValue("");
    jsEditor.setValue("");
    updatePreview();
    loadFileList();
  }
}

function newFile() {
  currentFileName = null;
  htmlEditor.setValue("");
  cssEditor.setValue("");
  jsEditor.setValue("");
  updatePreview();
  fileSelect.value = "";
}

function changeTheme(theme) {
  htmlEditor.setOption("theme", theme);
  cssEditor.setOption("theme", theme);
  jsEditor.setOption("theme", theme);
  if (theme === "dracula") {
    document.body.style.backgroundColor = "#282a36";
    document.body.style.color = "#f8f8f2";
  } else {
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#000";
  }
}

fileSelect.addEventListener("change", (e) => {
  loadFile(e.target.value);
});

newFileBtn.addEventListener("click", newFile);
saveFileBtn.addEventListener("click", saveFile);
deleteFileBtn.addEventListener("click", deleteFile);
runBtn.addEventListener("click", updatePreview);
themeSelect.addEventListener("change", (e) => {
  changeTheme(e.target.value);
});

htmlEditor.on("change", updatePreview);
cssEditor.on("change", updatePreview);
jsEditor.on("change", updatePreview);

// Initialize
loadFileList();
changeTheme(themeSelect.value);
updatePreview();
