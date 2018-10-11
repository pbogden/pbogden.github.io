import pandas as pd
import json

filename = "../data/Data for Geo Distribution of loans.xlsx"

wb = pd.ExcelFile(filename) # Load the excel workbook
sheetname = wb.sheet_names[0] # First in a list of sheetnames
print('Sheet name:', sheetname)

df = wb.parse(sheetname)  # Read sheet into a DataFrame

states = set( df['State'].tolist() )
print(len(states), 'states:', states)

# Create a list of tuples
t = df[['All Property Unit Count', 'State']].apply(tuple, axis='columns')
print(t)

# Group by 2nd column, and then apply list on first column
s = df.groupby('State')['All Property Unit Count'].apply(list)
print(s)

print(type(s))

print( s['WI'], type(s['WI']) )

# Create dictonary with results
data = {}
for state, v in s.items():
    data[state] = sum(v)
    print(state, 'SUM:', sum(v))

# Write dictionary to file as JSON
f = open('sums.json', 'w')
f.write(json.dumps(data))
