function preprocessMarkdown(md){
    md = md.replace(/\\/g, '\\\\');
    md = md.replace(/(?<!\\)\[([^\[\]()\n]+)\](?!\()/g, '[$1]($1)');
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
        // 공백 포함 여부 확인
        if (link.includes(" ")) {
            const safeLink = link.replace(/ /g, '%20');
            return `[${text}](${safeLink})`;
        }
        return match;
    });

    return md;
}

function loadMarkdown(mdfile){
    fetch(mdfile)
    .then(res => {
        if(!res.ok) throw new Error("파일을 찾을 수 없습니다.");
        return res.text();
    })
    .then(md => {
        md = preprocessMarkdown(md);
        document.getElementById("content").innerHTML = marked.parse(md);
        MathJax.typeset();
        enableWikiLinks();
    })
    .catch(err => {
        document.getElementById("content").innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
    });
}

function enableWikiLinks(){
    document.querySelectorAll('#content a[href]:not([href^="http"])').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href').trim();
            const newDir = `doc=doc/${encodeURIComponent(href)}/text.md`;
            const newURL = `?doc=doc/${encodeURIComponent(href)}/text.md`;
            
            history.pushState({doc: href}, '', newURL);
            loadMarkdown(newDir);
        });
    });
}

function getDocFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('doc') || 'doc/Main/text.md';
}

// TODO: 검색 로직 구현
// TODO: 문서 역사
// TODO: 수정 패널