---
date: 2016-04-04
title: 'Using Amazon S3 for your static site? One thing to keep in mind'
template: post
slug: using-amazon-s3-for-your-static-site-theres-one-thing-to-keep-in-mind-2
categories:
 - Bug Bounty
 - System Administration
tags:
 - Bug Bounty
 - System Administration
---

Amazon is a great service for hosting your static website. The way it works is by creating a S3 bucket with the name of your website, uploading your files to the bucket and changing the permissions so that the bucket can be read by the internet.

So long as your domain points to this bucket, you are all good. However, as you may have realized, if you delete this bucket your website will display an error saying something like:

```
Code: NoSuchBucket
Message: The specified bucket does not exist
BucketName: www.yourdomainhere.com
RequestId: 81A482BC4A49135C
HostId: fmi7A3bgEjRFxah/hxzyGx1FKy5Pte3+BK6TrNWcgy9KwsabLODfXZmGagnWkz3J
```
This is what some people don't think about, if your domain points to an empty bucket, nothing is stopping an attacker from creating a bucket with the same domain name as the victim. Now the attacker can serve any content under the victim's domain name, since the attacker owns the bucket.

This was the exact scenario I experiences a couple of weeks ago. I found a website belonging to a developer who had done some bucket cleaning and deleted most of his buckets. However he forgot that his old domain was still active and now pointing to an empty bucket. I noticed this when I saw the bucket error on his website and tried to create a bucket with the same name as his domain, and it worked! I didn't do any thing malicious, I wrote Hello in index.html and the previous bucket error was gone and my content was showing.

I reached out to the developer the next day on twitter explaining the situation, he was happy I detected the problem and asked me to hold on to the bucket until he got  time to fix it. Once I deleted the bucket he could create it and everything was alright again.

### Conclusion
This can be a very stealthy attack depending on how it is executed and quite dangerous since it gives the attacker 100% control over the content served under the domain. It's also possible to create a script to find websites displaying the `NoSuchBucket` error and automatically creating the bucket.

So, remember your buckets people!

