---
date: 2016-06-08
title: 'Securityfest CTF - Defacer Challenge Writeup'
template: post
slug: securityfest-ctf-defacer-challenge-writeup
categories:
 - CTF Writeup
tags:
 - CTF Writeup
---

I actually learned something entirely new on this challenge, I decided I had to do a writeup to share my findings.

If you read my [previous Securityfest CTF writeup](https://dubell.io/securityfest-ctf-coresec-challenge-writeup/) you perhaps know that these challenges were from [securityfest](https://securityfest.com/) held in Sweden, which I attended. I did not solve this particular challenge on time in order to win any prizes, but that didn't stop me from trying to solve it.

The challenge is to get the flag by defacing this website [http://alienzon.com/](http://alienzon.com/) which is protected by *(simple)* [WAF](https://www.owasp.org/index.php/Web_Application_Firewall). I actually spent 4-5 hours on this challenge testing different attack vectors that did not work. I tried SQL injections and XSS attacks all over the place but no joy. So I turned to the place where I thought would be the correct path because it most the most odd part of the website. It was on the *Fun Stuff* page under **Be a hero in a star story!** section. The odd thing about this part is that when you enter your name and click submit, the post request looks like this:
```
who=/Han+Solo/&yourname=Hacker
```

Why are there forward slashes in the request?

After playing with the `who` parameter for quite some time I realized that if I change the parameter to:
```
who=/Han/&yourname=Hacker
```

The story on the next page would say *Hacker Solo*. It didn't click before but now I knew the backend code was most likely using [preg_replace()](http://php.net/manual/en/function.preg-replace.php) to replace the strings. This information at first didn't help me very much, I continued to change the parameter thinking I could perhaps trigger a XSS but nope.

After a while I gave up and just googled *preg_replace exploits*, first website to show up was [http://www.madirish.net/402](http://www.madirish.net/402). According to that website, if the `e` modifier is used with the regular expression, an attacker may have the possibility to execute PHP code. Armed with this new information I crafted this fine request:
```
who=/(Han)/e&yourname=strtoupper($1)
```

I put **Han** in parentheses because that creates a group which you can match with the $1. The `strtoupper()` function simply converts a supplied string to uppercase. I sent the request away and checked the output, *Han* was now *HAN*, it goddamn worked. I now have a [RCE](https://en.wikipedia.org/wiki/Arbitrary_code_execution).

I sent the following request to identify the user running the web server:
```
who=/(Han)/e&yourname=`id`
```

At first I tried double quotes but that didn't work, then I tried single quotes but that got blocked by the WAF. So I tried the *grave accent* character \` and voila, it worked. The user running the web server was `www-data`.

Next was to list all the files in the directory:

```
who=/(Han)/e&yourname=`ls -lah`
```

Then view the config.php file:

```
who=/(Han)/e&yourname=`cat config.php`
```

Which gave me the following:

```
// Set the admin info here!
$admin_username = 'admin';
$admin_password = 'deepspace';
[...]
```

Now I simply login with the above credentials and get the flag:
```
CODE{R3gular_Expr3ssions_Now_You_Have_2_Probl3ms}
```

