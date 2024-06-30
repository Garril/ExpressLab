// axios建议es module导入，但这是node
// 他将 commonjs导出丢到了default中
const axios = require('axios').default;
const cheerio = require('cheerio');

// 获取 豆瓣页面源代码
async function getBooksHTML() {
  const res = await axios.get("https://book.douban.com/latest");
  return res.data;
}

// 从页面 HTML 获取到 书籍 详情页连接列表
async function getBooksLinks() {
  const html = await getBooksHTML();
  const $ = cheerio.load(html);
  // 超链接
  const aElements = $('#content .chart-dashed-list li.media .media__img a');
  // 获取到的都 cheerio对象---jquery，通过get获取数组
  const hrefLinks = aElements.map((i, ele) => {
    const href = ele.attribs['href'];
    return href;
  }).get();
  return hrefLinks;
}


async function getBookDetail(linkUrl) {
  const res = await axios.get(linkUrl);
  const $ = cheerio.load(res.data);
  // 标题
  const title = $('#wrapper > h1').text().trim();
  // 封面图片
  const imgSrc = $('#mainpic img').attr('src');
  // 作者名称（考虑可能并不是在第一列的情况）
  const spanList = $('#info span.pl');
  const authorSpan = spanList.filter((i, ele) => {
    return $(ele).text().includes('作者')
  })
  const authorName = authorSpan.next("a").text();
  // 出版年
  const publishSpan = spanList.filter((i, ele) => {
    return $(ele).text().includes('出版年');
  });
  const publishDate = publishSpan[0].nextSibling.nodeValue.trim();

  return {
    name: title,
    imgUrl: imgSrc,
    publishDate,
    author: authorName
  }
}

async function fetchAll() {
  const links = await getBooksLinks();
  const infoList = links.map((link) => {
    return getBookDetail(link)
  })
  return Promise.all(infoList);
}


const bookServ = require('../services/bookService');

fetchAll().then(res => {
  bookServ.addBook(res);
})
