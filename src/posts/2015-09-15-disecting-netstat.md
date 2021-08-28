---
date: 2015-09-15
title: 'Basics of netstat'
template: post
slug: disecting-netstat
categories:
 - Network Security
tags:
 - Network Security
---

Netstat is a network tool available in most versions of Windwos, Mac OS X and Linux. You can use Netstat to view network information and statistics about the network you are currently connected to.

You could view information about incoming/outgoing connections, routing table, protocol statistics and interfaces.

On linux netstat has been deprecated, the command `ss` should be used instead. The difference between the two is that `ss` can display more information about TCP and connection states.

## Running Netstat
Running netstat is as simple as writing `netstat` in your terminal. You should have some like this:

![](../images/Screen-Shot-2015-09-19-at-17-48-13.png)

But what does the output mean? I'll walk you through it.

#### Proto
Indicates which protocol is being used, TCP or UDP for example.

#### Recv-Q
How many bytes the receiver has in their buffer not yet copied by the user program.

#### Send-Q
Amount of bytes sent but not acknowledged by the remote host.

#### Local Address
The port number and address of the local socket. Unless the `-n` argument is passed the address is translated to its FQDA and port number is translated to its corresponding service.

#### Foregin Address
Address and port number of remote host. (See local address)

#### State
The current state of the socket.

## Some Commands

##### List all ports
`netstat -a`

##### List all tcp ports
`netstat -at`

##### List all udp ports
`netstat -au`

##### List only listening ports
`netstat -l`

##### Show statistics for all ports
`netstat -s`


## Conclusion
Netstat can be a great tool for identifying bottlenecks or checking for malicious incoming/outgoing connections. The Recv/Send queue can be great for network programmers to see if any bytes get stuck. Netstat could also be used for forensic analysis. 


#### References
http://linux.die.net/man/8/netstat

