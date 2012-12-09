import json

def parse(filepath):
	exoplanets = []
	f = open(filepath)
	keys = f.readline().strip().split(',')
	for line in f:
		line = line.strip().split(',')
		planet = {}
		for i in range(0,len(keys)):
			line[i] = None if line[i] == "" else line[i]
			planet[keys[i]] = line[i]
		exoplanets.append(planet)

	outfile = open('exoplanets.json','w')
	json.dump(exoplanets,outfile,indent=4)
	print "done"

parse('exoplanets.csv')