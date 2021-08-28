---
date: 2015-02-24
title: 'Dashing Dashboard'
template: post
slug: dashing-dashboard
categories:
 - System Administration
tags:
 - System Administration
---

![](../images/vizscreenshot2.png)
<small>*(Note: Not my dashboard above)*</small>

Not long ago I set up a dashboard for our office to show statistics about sales and such. The software we decided to use was [Dashing.io](http://dashing.io). Dashing is a Sinatra based framework written in ruby that lets you build beautiful dashboards.

I had no previous experience with ruby but it went well, as it was mostly syntax that differed from what I was used to.

Developing the API on our backend system and sending the data to Dashing in JSON format was a breeze. Fun little project.

We needed people to be able so sign in as well, to view the dashboard from outside the office. I connected it to our mysql database so users could sign in.

There's a lot of customization you can do with Dashing if you dive into it, I really recommend it.

