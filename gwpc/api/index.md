---
title: RBDMS API spec
layout: post
---

## Earthquake API spec

All apps created for GWPC use earthquake data from the (most excellent) API:

<a href="http://earthquake.usgs.gov/fdsnws/event/1/">USGS earthquake catalog API</a>

This API allows custom queries to get historical records from across the globe that go back many years.

Depending on their needs, it may make more sense for Oklahoma to implement only a single API with the most recent earthquakes. USGS again provides a concise API spec for their real-time feeds:

See: <a href="http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php">USGS earthquake feed API</a>

And they provide a collection of URIs for the most common queries.  For example, this URI provides all the earthquakes across the globe in the last 30 days.

http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson

For Oklahoma, we can start with a single URI that provides all the earthquakes for the time period of interest.

## RBDMS API spec

For UIC wells, we should take a similar approach with similar data formats.  For example, here's a minimal spec for RBDMS API output (following conventions of USGS API). This is the JSON object for a single well:

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

