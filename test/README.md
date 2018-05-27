Did you row a 1x in the Head of the Potomac this year? Last year too?  Then you may find this interesting...

In a nutshell, I was wondering if I rowed any "better" this year.
But as any rower knows, that’s a tough question to answer.
Although my time was faster this year, maybe that’s just because of wind and current, 
or something else that has nothing to do with fitness or technique.
Conditions can change dramatically from year to year, and they have a large effect on everyone.
The graph below attempts to remove those effects, and to leave behind
an answer to the question: "Did you row any better this year?"

<div id="container" style="position: relative; top: 0; left: 0; width: 100%; height: 0; padding-bottom: 52.1%; scrolling='no'">
  <iframe src="http://pbogden.com/racing/2" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
Your browser doesn't support iframes
  </iframe>
</div>
Here's the thinking: if conditions were faster this year, then a bunch of people should have 
been faster for the same reason. So we should be able to remove some sort of average "race-conditions factor" 
from the finish times. Right? Hmmm...

So, I got some data off the Potomac Boat Club website and computed the difference in finish times (2017 minus 2016) for everyone who rowed both years. You can mouse over (or touch) the graphic to see who did what.

### Did you row any "better" in 2017?

It depends on how you look at it.  You can toggle between two views of the data...

* Before (red): Raw data, including effects of wind, current, different course length, etc.
* After (blue): Data after modeling and then removing those effects

In other words, the position of your red dot tells you whether it took you more or less time to cover the course. But your blue dot gives you a much better idea of how things like fitness and technique affected your performance.
So, if your blue dot is below the dashed line, then you rowed "better" this year.

### ...and compared to 2015?

<div id="container" style="position: relative; top: 0; left: 0; width: 100%; height: 0; padding-bottom: 52.1%; scrolling='no'">
  <iframe src="http://pbogden.com/racing/1" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
Your browser doesn't support iframes
  </iframe>
</div>

### What the heck?

TL;DR: I just fit a line to the raw data (Before: red) in order to model the conditions that have similar impact on everyone's boat speed, and then removed it (After: blue).

----

But if you really want to know what's going on, then let's do some math. First, define some terms...

* `T1` = racer's finish time in 2016 (measured)
* `D` = length of the course in 2016 (unknown)
* `s` = racer's average speed in 2016 (unknown)

Then we know that:

    T1 = D / s

Next, define a few more terms

* `T2` = racer's finish time in 2017 (measured)
* `d` = difference in course length between 2016 & 2017 (unknown, same for everyone)
* `s'` = difference in racer's boat speed between 2016 & 2017 due to fitness & technique (unknown, WE WANT THIS!)
* `c` = difference in speed (2016 & 2017) due to wind & current (unknown, same for everyone)

Then we know that

        T2 = (D + d) / (s + s' + c)

Actually, this is only sort of true because we made some modeling assumptions, but we'll go with it anyway.

If we do a little algebra and then combine these two equations for T1 and T2:

        T2  = D / (s + s' + c) + d / (s + s' + c)
            = D/s * (1 - s'/s - c/s) + t'        using t' = d / (s + s' + c)
            = T1 - T1*(s'/s + c/s) + t'          (approximately true, because 1 / (1 + e) ~ (1 - e) when -1 << e << 1)
            = T1 - T1*(s'/s) - T1*(c/s) + t'

We end up with a single equation that describes the "Before" versions of the graphs above:

        Before:  T2 - T1 = T1*(s'/s) - T1*(c/s) + t'

Although we made some assumptions to get to this point, they're not too bad.
In any case, each term in the equation has a straightforward interpretation:

* `T2 - T1` = 2017 finish time minus 2016 (measured and plotted on the vertical axis)
* `t'` = time it takes to row the extra course length (almost the same for everyone)
* `T1 * (c/s)` = time difference due to wind/current (proportional to `T1` for everyone)
* `T1 * (s'/s)` = time difference due to rower fitness/technique (WE WANT THIS!)

We fit a line to estimate `t'` and `T1 * c/s` (good old linear regression).  Then we remove them to get the "After" versions of the charts, which attempts to isolate the time difference due solely to changes in rower fitness/technique.

        After: T2 - T1 = T1*(s'/s)

----
----
