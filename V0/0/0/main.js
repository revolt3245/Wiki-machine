window.onpopstate = () => {
    console.log("뒤로가기");
    const doc = getDocFromURL();

    loadMarkdown(doc);
}

document.addEventListener('DOMContentLoaded', () => {
    const current = getDocFromURL();

    if (!window.location.search){
        history.replaceState({doc:'doc/Main/text.md'}, '', `?doc=doc/Main/text.md`);
    }
    loadMarkdown(current);
});

// edit buton
const edit_button = document.getElementById("edit_button");

edit_button.addEventListener('click', () => {
    console.log("edit");
    fetch("page/edit/edit.html")
    .then(res => res.text())
    .then(html =>{
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const bodyContent = doc.body.innerHTML;

        document.getElementById('content').innerHTML = bodyContent;
    })
    .catch(err => {
        console.error('불러오기 실패: ', err);
        document.getElementById('content').innerHTML = '<p style="color:red;">❌ edit.html을 불러올 수 없습니다.</p>';
    })
});