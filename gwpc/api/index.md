---
title: RBDMS API spec
layout: post
---

## Earthquake API spec

See: <a href="http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php">USGS earthquake API</a>

We can start with a single URI that provides all the earthquakes for the time period of interest.

## RBDMS API spec

Minimal spec for RBDMS API output (following conventions of USGS API). This is the JSON object for a single well:

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

