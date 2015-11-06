---
title: RBDMS API spec
layout: post
---

## Earthquake API spec

See: <a href="http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php">USGS earthquake API</a>

We can start with a single URI that provides all the earthquakes for the time period of interest.

## RBDMS API spec

Minimal spec for RBDMS API output (following conventions of USGS API):

```
{ api: String,
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
    }
    ... 
  ]
}
```

We can start with a single URI that provides all the well data for the time period of interest.
