import fs from 'node:fs/promises';
import path from 'node:path';

// Imported Notion data stays local; only article bodies and permanent assets are published.
const reviews = JSON.parse(await fs.readFile('content/notion/import.json', 'utf8'));
const existing = {
  'attention-is-all-you-need': 'blog/_posts/논문리뷰/2026-04-20-w2sd.md',
  'weight-sparse-transformers': 'blog/_posts/논문리뷰/2026-06-02-safq.md'
};
const list = [];
await fs.mkdir('blog/assets/reviews', { recursive: true });
await fs.mkdir('public/assets/reviews', { recursive: true });
for (const review of reviews) {
  let body = review.body.replace(/<br\s*\/?>(?:<br\s*\/?>)?/g, '\n\n');
  let imageIndex = 0;
  for (const match of [...body.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)]) {
    const url = new URL(match[2]);
    const ext = path.extname(url.pathname).toLowerCase() || '.png';
    const name = `${review.slug}-${++imageIndex}${ext}`;
    const target = `blog/assets/reviews/${name}`;
    try { await fs.access(target); } catch {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Image download failed: ${review.slug} (${response.status}). Refresh Notion source and retry.`);
      await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
    }
    await fs.copyFile(target, `public/assets/reviews/${name}`);
    body = body.replace(match[0], `![${match[1] || review.title}](/assets/reviews/${name})`);
  }
  let file = existing[review.slug];
  if (review.slug === 'attention-is-all-you-need') {
    const current = await fs.readFile(file, 'utf8');
    body = current.replace(/^---[\s\S]*?---\s*/, '').replace(/<center><img[^>]+><\/center>/g, '![Transformer architecture](/assets/Transformer-model-architecture.png)');
    await fs.copyFile('blog/assets/Transformer-model-architecture.png', 'public/assets/Transformer-model-architecture.png');
  } else {
    file ||= `blog/_posts/논문리뷰/${review.date}-${review.slug}.md`;
    const header = `---\ntitle: ${JSON.stringify('[논문리뷰] ' + review.title)}\nlast_modified_at: ${review.date}\ncategories: [논문리뷰]\ntags: [LLM, Paper]\nuse_math: true\nclasses: wide\nnotion_source: ${JSON.stringify(review.source)}\n---\n\n`;
    const notice = review.draft ? '> 작성 중인 학습 노트입니다. 현재까지 작성한 원문을 옮겼으며 이후 보완할 예정입니다.\n\n' : '';
    await fs.writeFile(file, header + '{% raw %}\n' + notice + body + '\n{% endraw %}\n');
  }
  const slug = path.basename(file).replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  list.push({ ...review, body, url: `https://iris112-sung.github.io/${encodeURIComponent('논문리뷰')}/${slug}/`, excerpt: body.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/[#*>`]/g, '').trim().split('\n').filter(Boolean).find(line => line.length > 60)?.slice(0, 150) || review.title });
}
await fs.writeFile('src/reviews.json', JSON.stringify(list, null, 2));
console.log(`Imported ${list.length} reviews; existing Attention article retained. All Notion images stored locally.`);
