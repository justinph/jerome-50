#!/usr/bin/python

import csv
import json

'''
Reads in data from an exported excel worksheet and attemps to make json that
we can use to read into d3.js

This one takes data from the film/video program for the various genres and turns them into
splits for years

'''

def maybe_zero(item):
	if item == '': 
		return 0
	else:
		return item

print 'key,year,number'
with open('../data/fv/base_data.csv', 'rU') as csvfile:
	csvreader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
	for row in csvreader:
		#applications int(row['applications']) - int(row['approved']) 
		print 'Animation,%s,%s' % (row['year'], maybe_zero(row['Animation'])  )
		print 'Documentary,%s,%s' % (row['year'], maybe_zero(row['Documentary'])  )
		print 'Narrative,%s,%s' % (row['year'], maybe_zero(row['Narrative'])  )
		print 'Experimental,%s,%s' % (row['year'], maybe_zero(row['Experimental'])  )

		# print 'denied,%s,%i' % (row['year'], denied  )


