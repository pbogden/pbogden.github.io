# Writes nycflights13 to CSV file with a header
library(nycflights13)
library(dplyr)

write.table(airlines, file = "airlines.csv", sep = ",", row.names=FALSE, quote=FALSE, na="", qmethod = "double")
write.table(airports, file = "airports.csv", sep = ",", row.names=FALSE, quote=FALSE, na="", qmethod = "double")
write.table(planes,   file = "planes.csv",   sep = ",", row.names=FALSE, quote=FALSE, na="", qmethod = "double")
write.table(weather,  file = "weather.csv",  sep = ",", row.names=FALSE, quote=FALSE, na="", qmethod = "double")
write.table(flights,  file = "flights.csv",  sep = ",", row.names=FALSE, quote=FALSE, na="", qmethod = "double")
