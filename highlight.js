window.hljs = {
  highlightElement(el) {
    if (!el || !el.textContent) return;
    const lang = el.className.includes("json") ? "json" :
                 el.className.includes("xml") ? "xml" :
                 el.className.includes("plaintext") ? "plaintext" : "";
    el.innerHTML = el.textContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (lang === "json") {
      el.innerHTML = el.innerHTML
        .replace(/("(\u[a-zA-Z0-9]{4}|\[^u]|[^\"])*"(\s*:)?)/g,
                 match => {
                   const cls = match.endsWith(':') ? 'key' : 'string';
                   return `<span class="${cls}">${match}</span>`;
                 })
        .replace(/\b(true|false|null)\b/g, '<span class="boolean">$1</span>')
        .replace(/\b\d+(\.\d+)?\b/g, '<span class="number">$&</span>');
    }
    if (lang === "xml") {
      el.innerHTML = el.innerHTML
        .replace(/(&lt;\/?)([\w:-]+)(.*?)(\/?&gt;)/g,
                 (_, a, b, c, d) => `${a}<span class="tag">${b}</span>${c}${d}`);
    }
  }
};