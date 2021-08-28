import parseMD from '$lib/prasemd'
import fs from "fs"
import showdown from "showdown"

export function process(filename: string) {
  const fileContents = fs.readFileSync(`${filename}`, 'utf8')
  const { metadata, content } = parseMD(fileContents)


  let converter = new showdown.Converter();
  converter.setOption('ghCodeBlocks', 'true');
  let html: string = converter.makeHtml(content);

  return { metadata, html };
}
