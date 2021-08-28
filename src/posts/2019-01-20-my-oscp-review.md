---
date: 2019-01-20
title: 'My OSCP Review'
template: post
slug: my-oscp-review
#thumbnail: "../images/offsec-student-certified-emblem-rgb-oscp.png"
categories:
 - OSCP
 - Certification
tags:
 - OSCP
 - Certification
---

In this blog post I'll write about my experience taking the OSCP certification as well as some recommendations for people wanting to take the exam.

I got access to the OSCP lab network 2019-09-09 and lost access 2019-12-08. As you can see I chose 90 days of lab time. The number one thing I read in all the OSCP reviews out there was that do not underestimate the amount of time it takes to be successful in the lab network.

At the time I was working as a software developer, working 8-9 hours a day, five days a week. I constantly read that I need to prepare to spend at least 3-4 hours a day in the labs, oh boy were they right! 30 days of lab time was out of the question, I knew that was too little. 60 days sounded doable but I settled with 90 days because I knew there would be no chance in hell that I would spend every day hacking in the labs. When you come home after work you just want to chill sometimes and spend time with your significant other. The 90 days was perfect for me, all though it did require roughly 24 hours of work per week. Lucky me my employer granted me one day a week to dedicate time for OSCP, without that one day I personally would not have spent as much time as I would need to and I would probably not have passed on my first try. Every Friday I spent 8-9 hours on the OSCP labs while the rest of the time was spent on weekends and some evenings after work.

## Prerequisites

When you get access to the network, you also get a PDF containing all the information you need to hack most of the machines. I say most because while the PDF contains a lot of information, depending on your skill level and experience with system administration, some machines you probably never will hack just by using the PDF as your resource, in my opinion. The PDF kinda gives you a base level on wide selection of technologies, and I think Offensive Security wants you to build upon this base level by finding and reading other resources as you progress in the network(s). Which is super great, because it forces you to look for information and not simply get it served on a silver plate.

Each chapter also contains 3-5 exercises which you can complete and add to your lab report. The lab report is optional but you do get five extra points on your exam if you document at least 10 machines and complete all exercises. I actually just did exercises the first month since I thought that those 5 extra points can be what stands between you and an OSCP certificate :) However, I lost interest in completing all the exercises because many of them just took too much time from me, time I could spend doing some actual hacking. All though I did document 10 machines that I hacked. I highly recommend you to document at least 10 machines that you hack because you will get familiar with how you should structure your report.

Personally, out of the 16 chapters maybe 3-4 chapters gave me new insight which I did not have earlier. The rest I already knew or were familiar with. I started playing wargames when I was around 13 years old, done many CTFs and vulnerable machines, so I already had some background in many of the areas that the network offered.

## Preparing for the journey

Before starting my OSCP journey, I continued hacking machines over at hackthebox.eu which is a fantastic site to learn more about offensive security. I completed maybe 4-5 boxes before I felt ready to start my adventure.

## Hacking the networks

During my 90 days I hacked 26 machines out of ~50 machines, two of the machines belonged to the IT network. The network diagram can be seen below:

![pwk-network](https://support.offensive-security.com/images/pwk-labs.png)

I never progress beyond the IT Department simply because there are so many machines to hack in the public network and so little time :) Although, it would have been fun to move into the other networks as well.

Each machine took roughly 3-4 hours to complete. Some machines took 20 minutes and some took 1 hour. The easy machines could be hacked simply by firing up metasploit but I tried to stay away from metasploit as much as I could. I always tried to use the scripts that usually comes along with the PoC exploit. Therefore it sometimes took hours to get a simple shell because something didn't work with the script. Had I used metasploit it would most likely have gone faster.

I pwned 26 machines, including "the big three": PAIN, SUFFERANCE, and HUMBLE.

## Exam Day

I made the grave mistake to schedule my exam one month after my lab time ended. I did not do this on purpose, I simply waited too long before I scheduled it, all slots were taken.

I scheduled my exam time at 13:00 which maybe was a little bit too late. In hindsight, 11:00 would have perfect for me.

You have 23 hours and 45 minutes to hack a maximum of five machines. You need at least 70 points to pass the exam.

I started at 13:00 and by 12:00 I had three machines in the bag. As always, there was a buffer overflow machine in which you are provided a small PoC code and a vulnerable service that you are supposed to hack by exploiting the buffer overflow. It's a standard buffer overflow vulnerability, nothing more special about it. I calculated that I would most likely hack the buffer overflow machine within 1 hour, however it turned out I was being stupid at one point in the process so it took 2 hours! No biggie though.

The next two machines followed the same process in the labs:

1. Enumerate all services
2. Identify vulnerability
3. Exploit vulnerability
4. Get limited shell access
5. Escalate Privileges
6. Get root shell

It may sound easy but when you are actually doing it, there are so many potential rabbit holes to stay clear from. Especially during privesc.

Around 04:00 I had root shell on the fourth machine and a passing grade. The fourth machine was really tough though, not because it was hard, but because I was tired and couldn't think straight. I was not keeping it simple, instead I made everything complex and hard. But at some point I gained clarity and finally pushed through and got root. Went to bed after documenting my process.

Woke up at 09:00 and started to hack around 09:30. I got maybe 4-5 hours of sleep. The last and final machine, I thought that this must be easy, I have come this far, no machine can stop me now! Boy was I wrong. I was suuuper tired, but I throw everything I knew at the last box, but I could not gain any foothold what so ever. Nothing I did worked.

I gave up at 11:00 with only 45 minutes left before they would cut of my access. I trippled checked all my notes and screenshots for every hacked machine to make sure I was not missing anything.

## Write the report

At 12:45 sharp, my access was broken. Finally, I was done, almost. After the exam you have an additional 24 hours to write your report. For some reason, I felt like the reporting part was harder than the actual exam. Most likely because I have read how people fail their certification because of simple mistakes. I did not want to fail because I missed a screenshot or failed to include vital information.

23 hours later I submitted my report according to the instructions given. The following Monday I received the awesome news that I had passed the certification!

## Conclusion

If you have no experience with what OSCP offers, I suggest you start doing hackthebox.eu to get a grasp on all the different technologies and tools.
Actually, it doesn't matter where your current skill level is at, go to hackthebox.eu and start pwning boxes!

Depending on your current living situation, you may be fine with 60 days and not 90 days. Although, a good strategy could be to schedule 90 days but do the exam after ~60 days. Doing so gives you an extra 30 days to practice if you failed your first attempt. Either way, remember that you will be needing to spend at least 16 hours per week dedicated to OSCP. Of course this varies depending on skill level, but I believe 16 hours is bare minimum.

Develop a process, a methodology in the labs. What is the first you do when you are given an IP? A popular CMS is hosted on the web server, what do you do? The linux kernel is 2.6, what do you do?

By defining this process and sticking to it, you will most likely have no problem passing the certification.

When it comes to the reporting, keep it simple and make sure you include all the necessary information to reproduce your steps so that somebody else can exploit the system. Make sure to take plenty of screenshots during the exam.

That's all for me, if you have any further questions or observations, you know how to contact me!