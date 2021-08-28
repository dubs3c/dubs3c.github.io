---
date: 2016-06-12
title: 'Monitoring your server with Monit'
template: post
slug: monitoring-your-server-with-monit
categories:
 - System Administration
tags:
 - System Administration
---

I run a couple of services on my server, some of them are web, teamspeak, irc and an openvpn server. I need to be notified if any of these services becomes unresponsive for some reason. This is where [Monit](https://mmonit.com/monit/) comes in.

## What is Monit?

> Monit is a small Open Source utility for managing and monitoring Unix systems. Monit conducts automatic maintenance and repair and can execute meaningful causal actions in error situations.

I use monit to monitor all my services and alert me via email if any service does not respond. For example, this is my monit configuration file for monitoring my web server:
```
check host dubell.io with address dubell.io every 20 cycles 
  if failed
        host dubell.io
        port 443
        protocol https
        status = 200
  then alert
```

This config file informs monit to check my website every 10 minutes and raise an alert if the HTTP status is not 200. An alert message looks like this:
```
Connection failed Service dubell.io

        Date:        Sun, 12 Jun 2016 21:03:16
        Action:      alert
        Host:        dubellio
        Description: failed protocol test [HTTP] at [dubell.io]:443 [TCPSSL/IP] -- HTTP error: Server returned status 502

Your faithful employee,
Monit
```

Monit will also inform you when a service starts responding again:

```
Connection succeeded Service dubell.io

        Date:        Sun, 12 Jun 2016 21:04:19
        Action:      alert
        Host:        dubellio
        Description: connection succeeded to [dubell.io]:443 [TCPSSL/IP]

Your faithful employee,
Monit
```

If you would like to monitor your own teamspeak server, you could do something like this:

```
check host youteamspeak.com with address 192.168.0.1
   if failed
     port 9987
     type udp
   then alert
```

If the teamspeak server does not respond using UDP packets on port 9987, raise an alert.

## Automatic Repair
What's great about Monit is that you can also specify what to do in the event of a crashed service. You can program monit to restart services or execute a specific program.

In the following example we use udp for connection testing to check if the name-server is running, if false then restart the service:

```
 check process named with pidfile /var/run/named.pid
       start program = "/etc/init.d/named start"
       stop program  = "/etc/init.d/named stop"
       if failed port 53 use type udp protocol dns then restart
```

## Conclusion
Monitoring your services are a must for any serious applications or networks. Monit is a great and easy tool for making sure that servers and services are up and running.

Check out the [monit documentation](https://mmonit.com/monit/documentation/monit.html) to find out what more you can do with Monit! 

