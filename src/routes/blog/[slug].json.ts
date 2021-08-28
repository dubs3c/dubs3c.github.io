import {process} from '$lib/markdown';
import { PostsLocation } from "$lib/posts"
import fs from "fs"

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
 export function get({ params }) {
    // we could get the dynamic slug from the parameter of get.
    const { slug } = params;

    let location: string = PostsLocation;
    let filename: string = "";

    // it works, don't hate
    fs.readdirSync(location).forEach(file => {
        if(file.endsWith(`${slug}.md`)) {
            filename = file
            return
        }
    });

    if(filename === "") {
        throw new Error(`Error: Filename '${slug}'.md does not exist in '${location}'`)
    }
  
    const { metadata, html } = process(`src/posts/${filename}`);
    const body = JSON.stringify({ metadata, html });
  
    return { body }
}