---
date: 2016-09-10
title: 'SEC-T CTF - Confusion Writeup'
template: post
slug: sec-t-ctf-confusion-writeup
categories:
 - CTF
tags:
 - CTF
---

This time I participated in the [SEC-T CTF](https://www.sec-t.org/) event and it was pretty fun! I played with a group of people from my university and we managed to get quite some points. But I didn't manage to solve some of the challenges on time. However this didn't stop from trying to solve them once the event was over!

One of the challenges I was hooked on was called **Confusion**. The reason why was because it seemed like an "easy" challenge but for some reason I couldn't figure it out! The challenge began by downloading the following image:

![](../images/confusion.png)


I ran `binwalk` on the file and got the following results:
```
DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 422 x 92, 8-bit/color RGBA, non-interlaced
91            0x5B            Zlib compressed data, compressed
2128          0x850           GIF image data, version "87a",
2259          0x8D3           gzip compressed data, from FAT filesystem (MS-DOS, OS/2, NT), NULL date (1970-01-01 00:00:00)
2600          0xA28           JPEG image data, EXIF standard
```

Alright, it looks like we got some hidden files within the image. I ran `strings` as well and found some interesting stuff:

```
1337.pdf
.1337
WYSIWYG: Does not compute,what would Phil Katz say?
``` 

According to google, Phil Katz is the co-creator of the Zip file format, which got me thinking that there has to be an embedded .zip file containing something called 1337. Easy peasy!

I went to [Wikipedia](https://en.wikipedia.org/wiki/Zip_(file_format)) to lookup the magic number used for the zip format. Turns out it can be one of the following:
```
PK\x03\x04 , PK\x05\x06 (empty archive), or PK\x07\x08
```

I loaded the image file in my HEX editor (Hex Fiend) and begun searching for these magic numbers. I found 1 occurrences of **PK** which was followed by **1337**. Looks like I cracked the case....or not. I tried copying different parts of the data after the first occurrence of **PK** to a new file but no joy.

![](../images/Screen-Shot-2016-09-10-at-23-28-52.png)
######**Figure 2:** First occurrence of PK

I was stuck at this point and begun researching more about zip files and found these two resources, [1](http://resources.infosecinstitute.com/steganography-what-your-eyes-dont-see/) and [2](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html). I learned quite a lot about the structure of .zip files. According to [1](http://resources.infosecinstitute.com/steganography-what-your-eyes-dont-see/) the .zip file should begin with **PK** and end with **Pk**. However I couldn't find any other **Pk** so obviously I was missing something. I even tried inserting the correct trailer but that didn't work as well.

After some hours of testing and reading I finally noticed the `UEs=` which can be seen in figure 2. Initially I thought it was base64 encoded data but didn't really act on that instinct, until later. It actually was base64 encoded data and it turned out to be **PK**! Finally some progress.

I tried to copy the data between the first occurrence of **PK** and `UEs=` (PK) but that didn't work either. My next idea was to search for more occurrences of `UEs=` and lo and behold, I found one.

![](../images/Screen-Shot-2016-09-10-at-23-57-32.png)
######**Figure 3:** Second occurrence of UEs=

I decoded the second `UEs=` found and copied the data between that one and the first **PK** because according to [1](http://resources.infosecinstitute.com/steganography-what-your-eyes-dont-see/), the .zip file should start with **PK** and end with **Pk**. I created a new file with the copied data, saved as file.zip and tried to unzip but no joy! I knew I had to be on the correct path so I continued working with the HEX values for quite some time but I couldn't unzip the file without errors. I started to google how to recover corrupted zip files and found this command:

```
$ zip -FF file.zip --out result.zip
```

I ran the command and it successfully recovered the .zip file and dropped a .pdf file containing the following text:

![](../images/Screen-Shot-2016-09-11-at-00-14-03.png)
######**Figure 4:** A font consisting of symbols

I copied the text into my URL bar and BAM, the flag was: `sect{I_4m_n0t_3ncrypt3d}`

## Conclusion
SEC-T CTF was fun and I will most definitely play again in the future. I was a little bit disappointed that I couldn't solve this challenge in time, but hey, next time there won't be any .zip files that can hide from me ;)

Never doubt your instincts!

#### References
[1] http://resources.infosecinstitute.com/steganography-what-your-eyes-dont-see/

[2] https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html

