// 统计字数函数
// 配合Editor.js编辑器使用
// blocks是Editor.js生成的json格式段落
export function countWords(title, content) {
    console.log(title);
    const blocks_num = Object.keys(content).length !== 0  ? content.blocks.length : 0;
    let words_count = title.length;
    for (let i = 0; i < blocks_num; i++) {
        const content_text = content.blocks[i].data.text.replace(/<\/?.+?>/g, "");
        words_count += content_text.length;
    }
    
    return words_count;
}
