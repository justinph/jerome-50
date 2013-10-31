#!/usr/bin/python

import csv
import json

'''
Reads in data from an exported excel worksheet and attemps to make json that
we can use to read into d3.js
'''

dataOut = []

print 'key,year,number'
with open('generalprogram_bundled.csv', 'rb') as csvfile:
	csvreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
	for row in csvreader:
		denied =  int(row['applications']) - int(row['approved']) 
		print 'granted,%s,%s' % (row['year'], row['approved'])
		print 'denied,%s,%i' % (row['year'], denied  )


		