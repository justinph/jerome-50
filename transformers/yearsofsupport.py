#!/usr/bin/python

import csv
import json

'''
Reads in data from an exported excel worksheet and attemps to make json that
we can use to read into d3.js
'''

dataOut = []

with open('yearsofsupport.csv', 'rb') as csvfile:
	csvreader = csv.reader(csvfile, delimiter=',', quotechar='"')
	for row in csvreader:
		#print row[0]
		startyear = int(row[0][0:4])
		endyear = int(row[0][5:9])
		name = row[1]
		numyears = row[3]
		#print startyear, endyear, name, numyears

		supportYears = {}
		for i in range(196,2014):
			if i > startyear and i <= endyear:
				supportYears[i] = i - startyear 
				#print i - startyear
			else:
				supportYears[i] = 0

		#print supportYears


		#unicode decoding to fix weird excel export issues
		data = {
				'supportYears': supportYears,
				'name': unicode(name, errors='replace'),
				'totalYears': unicode(numyears, errors='replace'),
				'rangeYears': unicode(row[0], errors='replace'),
				
			}
		#print data
		dataOut.append(data)

#print dataOut

print json.dumps(dataOut, indent=4)

		#print ', '.join(row)


# f = open('yearsofsupport.csv', 'r')
# for line in f:
# 	myline = line.split(',')
# 	startyear = line[0:4]
# 	endyear = line[5:9]
# 	name = myline[1]
# 	print startyear, endyear, name