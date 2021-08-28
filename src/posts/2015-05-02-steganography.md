---
date: 2015-05-02
title: 'Digital Steganography'
template: post
slug: steganography
categories:
 - Steganography
tags:
 - Steganography
---

There are many ways to conceal a message from untrusted entities, encryption is the far most used method for making sure no one but the intended receiver can read the message. However, there is an other method not widely used today and that is **Steganography**. In historical times people hid secret messages in all kinds of places where guards for example wouldn't look. I remember reading about a method where a "king" would have one his messengers shave their head and then they would write the message on the head and wait for the hair to grow back. Whoever waited for this message wasn't in a hurry...

This is the purpose of steganography, to hide a message in plain sight and not arouse suspicion to a hidden message.

### Why not use encryption?
The the purpose of encryption is to encrypt a message and make it unreadable, transfer the message to the intended recipient who is the only one who can decrypt the message. If someone intercepts the message in transit, they will immediately get suspicious because of the encrypted message. They may even try to break it. This is where steganography differs, since its purpose is to not attract attention to the hidden message.

### Should I use steganography instead of encryption?
No, you shouldn't. It all comes down to the level of secrecy you want to obtain. For most purposes regular encryption is fine, but if you want to transmit your message to your friend without arousing suspicion to the encrypted message, than perhaps steganography is something worth looking into.

You could also combine the best of both worlds, hiding an encrypted message within an image for example.

### So people still shave their heads today as well?
Not quite, modern steganography is mostly used in the digital world, hiding data in images, audio, network packets, video and documents.

### Hiding data within images
The most popular way of hiding data in images is the LSB (Least Significant Bit) method.

The following image may help you understand how pixels and LSB work.

![](../images/Untitled-1-2.png)

Lets say you have the following 3 pixels:
```
RED: 01100001
GREEN: 01101010
BLUE: 01100110
-
RED: 01110000
GREEN: 01100010
BLUE: 01100111
-
RED: 01101001
GREEN: 01110100
BLUE: 01101000
```

And you want to hide the following message:
`01110101`

Basically you would substitute each bit in your message with the LSB bit in each color channel.
```
RED: 0110000[0]
GREEN: 0110101[1]
BLUE: 0110011[1]
-
RED: 0111000[1]
GREEN: 0110001[0]
BLUE: 0110011[1]

RED: 0110100[0]
GREEN: 0111010[1]
BLUE: 01101000
```
As you can see the message has been encoded within the three pixels.

This method is very secure against visual attacks, meaning you can't see any differences between the stego image and the original image. However, with statistical analysis it's easy to detect that the image has been tampered with. Why? Because you create large distortions when you modify each pixel channel.

<table class="table">
<tr>
<th></th>
<th>Hexadecimal</th>
<th>Decimal</th>
<th>Red</th>
<th>Green</th>
<th>Blue</th>
</tr>
<tr>
<td>Original</td>
<td>DBDBDB</td>
<td>14408667</td>
<td>219</td>
<td>219</td>
<td>219</td>
</tr>
<tr>
<td>Stego</td>
<td>DCDCDC</td>
<td>14474460</td>
<td>220</td>
<td>220</td>
<td>220</td>
</tr>
</table>

As you can see in the example above, I have only modified the LSB bits but the difference between the original and stego color is 65793 in the scale of colors. That is a major distortion.

### Better ways to hide data?
There are plenty of better ways to hide data, but I'll save that for a future article ;)

##### References
<small>http://en.wikipedia.org/wiki/Steganography</small>


