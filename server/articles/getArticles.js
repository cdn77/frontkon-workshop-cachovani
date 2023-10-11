import { promises as fs } from "node:fs";
import * as path from "node:path";

const getArticles = () => [
  {
    title: "Hello world",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque iaculis suscipit dui nec volutpat. Curabitur ut dignissim risus. Maecenas facilisis ante in ex imperdiet commodo. Praesent vel massa hendrerit, porttitor eros et, pellentesque justo.",
  },
  {
    title: "Another article",
    text: `A distinctio fugiat consectetur corrupti dolor. Saepe reprehenderit ab et voluptatem non esse quaerat qui. Non dolorum aliquam atque tempore autem unde aliquid. Quasi quasi voluptatibus molestiae nemo dolore. Ut molestiae qui provident qui rerum. Laborum est illum minima aliquid commodi dicta facere ut.
Reprehenderit dolores aut fuga minus delectus aut. Quis blanditiis placeat repudiandae voluptate. Nostrum et similique praesentium. Suscipit sed dolorem fuga enim odio aut quibusdam et. Modi sed consectetur rerum.
Minus quod quia sint facilis architecto quia aspernatur. Velit quia et facilis aut tenetur. Quisquam suscipit consequatur tempora. Ipsam maiores perspiciatis molestias quod nobis nemo voluptas rerum. Omnis quia pariatur sed adipisci reiciendis recusandae.`,
  },
  {
    title: "Third article",
    text: ` Cras lorem sapien, euismod eget pretium nec, malesuada ut lorem. Aenean ac gravida ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut dapibus, orci at dictum congue, ligula leo egestas ante, sed tincidunt magna nibh non dolor. Sed ornare massa vel tortor aliquet, in scelerisque sem efficitur. Vivamus aliquam orci vel quam convallis vestibulum. Pellentesque ex tortor, dictum vitae neque scelerisque, ultrices viverra massa. Maecenas vulputate semper ligula sit amet pretium. Sed iaculis varius nisi, sit amet pellentesque dolor porta in. Nunc sed dolor vitae arcu pretium ullamcorper sit amet in lectus. Sed vitae luctus purus.
Nam ac rhoncus eros. Praesent bibendum, turpis sit amet vestibulum suscipit, urna ligula eleifend purus, eget tempus massa ex nec nulla. Mauris volutpat tellus nunc, non feugiat nibh tempor at. Etiam lectus purus, maximus et magna bibendum, ultrices dapibus ante. Ut ut ex at lectus blandit suscipit. Maecenas mollis nisl vehicula metus tincidunt molestie. Donec eu nibh nisi. Fusce hendrerit lobortis nulla, ut auctor purus sodales sed. Morbi et gravida nisl. Fusce commodo risus elit, eu iaculis tellus porttitor rutrum. In a purus finibus tellus maximus dignissim sit amet nec mauris.
Aenean hendrerit eros vel eros malesuada, vel vulputate urna efficitur. Sed eget blandit libero, imperdiet tempus orci. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent ut justo eu nisl luctus feugiat. Nam in arcu consequat sapien sodales molestie. Praesent dignissim varius nunc, ac sodales urna ultricies eget. Maecenas nec lorem ac turpis cursus faucibus. Duis lacinia ipsum vitae lacus porta venenatis. Mauris in ante sit amet eros fermentum convallis. Pellentesque gravida lacus at leo aliquam ultrices. Nullam sed eros imperdiet, fringilla nibh a, mattis quam. Phasellus ut interdum felis, id volutpat ligula. Curabitur condimentum placerat nisl, in luctus magna mollis vitae. Nulla facilisi. `,
  },
];

/**
 * Generates a HTML string containing a list of articles.
 * @param {string} staticPath
 * @returns {Promise<string>}
 */
export const getArticlesHtml = async (staticPath) => {
  const [pageTemplate, articleTemplate] = (
    await Promise.all([
      fs.readFile(path.join(staticPath, "/articles", "/index.html")),
      fs.readFile("./server/articles/article.html"),
    ])
  ).map((buffer) => buffer.toString());

  const articlesHtml = getArticles()
    .map(({ title, text }) =>
      articleTemplate.replace("{title}", title).replace(
        "{text}",
        text
          .split("\n")
          .map((paragraph) => `<p>${paragraph}</p>`)
          .join("")
      )
    )
    .join("");

  return pageTemplate.replace("{articles}", articlesHtml);
};
