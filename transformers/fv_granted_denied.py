#!/usr/bin/python

import csv
import json

'''
Reads in data from an exported excel worksheet and attemps to make json that
we can use to read into d3.js

This one takes data from the film/video program for the granted/denied/dollars split
and turns it into better data.

'''

dataOut = []

print 'key,year,number'
with open('../data/fv.csv', 'rU') as csvfile:
	csvreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
	for row in csvreader:
		denied =  int(row['applications']) - int(row['approved']) 
		print 'granted,%s,%s' % (row['year'], row['approved'])
		print 'denied,%s,%i' % (row['year'], denied  )


		