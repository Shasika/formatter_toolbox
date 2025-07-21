
function formatJSON() {
  try {
    const input = document.getElementById('input').value;
    const json = JSON.parse(input);
    const outputEl = document.getElementById('output');
    outputEl.textContent = JSON.stringify(json, null, 2);
    outputEl.className = 'language-json';
    hljs.highlightElement(outputEl);
    toggleOutputVisibility(true);
  } catch {
    showError("Invalid JSON format!");
  }
}

function formatXML() {
  try {
    const input = document.getElementById('input').value.trim();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, 'application/xml');
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) throw new Error();
    const formatted = formatXmlNode(xmlDoc.documentElement, 0);
    const outputEl = document.getElementById('output');
    outputEl.textContent = formatted;
    outputEl.className = 'language-xml';
    hljs.highlightElement(outputEl);
    toggleOutputVisibility(true);
  } catch {
    showError("Invalid XML content!");
  }
}

function decodeBase64() {
  try {
    const input = document.getElementById('input').value;
    const decoded = atob(input);
    const outputEl = document.getElementById('output');
    outputEl.textContent = decoded;
    outputEl.className = 'language-plaintext';
    hljs.highlightElement(outputEl);
    toggleOutputVisibility(true);
  } catch {
    showError("Invalid Base64 input!");
  }
}

function decodeJWT() {
  try {
    const input = document.getElementById('input').value;
    const parts = input.split('.');
    if (parts.length !== 3) throw new Error();
    const payload = JSON.parse(atob(parts[1]));
    const outputEl = document.getElementById('output');
    outputEl.textContent = JSON.stringify(payload, null, 2);
    outputEl.className = 'language-json';
    hljs.highlightElement(outputEl);
    toggleOutputVisibility(true);
  } catch {
    showError("Invalid JWT token!");
  }
}

function clearText() {
  document.getElementById('input').value = '';
  const outputEl = document.getElementById('output');
  outputEl.textContent = '';
  outputEl.className = '';
  toggleOutputVisibility(false);
}

function showError(msg) {
  const outputEl = document.getElementById('output');
  outputEl.textContent = msg;
  outputEl.className = 'language-plaintext';
  hljs.highlightElement(outputEl);
  toggleOutputVisibility(true);
}

function copyOutput() {
  const text = document.getElementById('output').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('inline-copy');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy', 1500);
  });
}

function toggleOutputVisibility(visible) {
  const wrap = document.querySelector('.output-wrapper');
  const btn = document.getElementById('inline-copy');
  wrap.classList.toggle('visible', visible);
  btn.classList.toggle('visible', visible);
}

function formatXmlNode(node, level) {
  const indent = '  '.repeat(level);
  let result = '';
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tag = node.nodeName;
    const attrs = [...node.attributes].map(attr => ` ${attr.name}="${attr.value}"`).join('');
    const children = [...node.childNodes].filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    if (children.length === 0) {
      result += `${indent}<${tag}${attrs}/>
`;
    } else if (children.length === 1 && children[0].nodeType === 3) {
      result += `${indent}<${tag}${attrs}>${children[0].textContent.trim()}</${tag}>
`;
    } else {
      result += `${indent}<${tag}${attrs}>
`;
      children.forEach(child => result += formatXmlNode(child, level + 1));
      result += `${indent}</${tag}>
`;
    }
  }
  return result;
}

document.addEventListener('DOMContentLoaded', () => {
  // Other format buttons
  document.getElementById('btn-json').addEventListener('click', formatJSON);
  document.getElementById('btn-xml').addEventListener('click', formatXML);
  document.getElementById('btn-base64').addEventListener('click', decodeBase64);
  document.getElementById('btn-jwt').addEventListener('click', decodeJWT);
  document.getElementById('btn-clear').addEventListener('click', clearText);
  document.getElementById('inline-copy').addEventListener('click', copyOutput);

  // 🌗 Theme toggle (icon)
  const icon = document.getElementById('theme-toggle');
  icon.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.textContent = next === 'dark' ? '🌞' : '🌙';
    document.getElementById('theme-mode').value = next; // sync dropdown
  });

  // ⚙️ Settings panel toggle
  document.getElementById('toggle-settings').addEventListener('click', () => {
    const panel = document.getElementById('settings-panel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  });

  // 🎨 Theme dropdown change
  document.getElementById('theme-mode').addEventListener('change', (e) => {
    const value = e.target.value;
    if (value === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', value);
    }
    icon.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '🌞' : '🌙';
  });

  // 🎨 Highlight color picker
  document.getElementById('theme-color').addEventListener('input', (e) => {
    const color = e.target.value;
    document.documentElement.style.setProperty('--button-bg', color);
    document.documentElement.style.setProperty('--highlight-key', color);
    document.documentElement.style.setProperty('--highlight-tag', color);
  });

  // 📦 Initial theme (auto mode)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = prefersDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', defaultTheme);
  icon.textContent = defaultTheme === 'dark' ? '🌞' : '🌙';
  document.getElementById('theme-mode').value = defaultTheme;
});

