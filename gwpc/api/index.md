---
title: RBDMS API spec
layout: post
---

## Earthquake API spec

All apps created for GWPC use earthquake data from the (most excellent) USGS API:

<a href="http://earthquake.usgs.gov/fdsnws/event/1/">USGS earthquake catalog API</a>

This API allows custom queries for global records that go back many years.

Depending on their needs, it may make more sense (and may be much simpler) for Oklahoma to implement only a single URI with the most recent earthquakes. For example, USGS has a concise API spec for their real-time feeds:

<a href="http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php">USGS earthquake feed API</a>

And USGS provides a collection of URIs for the most common queries.  For example, all the earthquakes from across the globe in the last 30 days are returned instantly to your browser if you click on this URI:

http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

For Oklahoma, we can follow the USGS lead (and adopt their API spec as a standard) by creating URI(s) that return all the earthquakes for the time period(s) of interest to Oklahoma.

## RBDMS API spec

For UIC wells, the API on the RBDMS database should be equally simple. For example, here's a minimal spec for RBDMS API response (it follows conventions of USGS API). This is the JSON object for a single well:

```
{ 
    api: String,
    longitude: Decimal,
    latitude: Decimal,
    other: type,
    data: [
        { 
            time: Long Integer,
            volume: Integer,
            tubing: Integer,
            casing: Integer
        },
        { 
            time: Long Integer,
            volume: Integer,
            tubing: Integer,
            casing: Integer
        },
        {
            ... 
        },

        ...

    ]
}
```

* "other: type" -- a placeholder for all other metadata relevant to a well
* "data" -- array of objects, including injection "volume," "tubing" pressure, and "casing" pressure
* any other variable that changes with time could be added to the "data" array

We can start with a single URI that provides all the well data for the time period of interest as an array of JSON objects, one for each well.

