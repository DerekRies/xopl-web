import json

exoplanets = {}
f = open('exoplanets.json')
# f = open('testdata.json')
data = json.load(f)
print(len(data))

stnames = []

for item in data:
    starname = item['pl_hostname']
    if starname in stnames:
        planet = {

        }
        for key in item:
            if key[0] == 'p' and key != 'pl_hostname':
                planet[key] = item[key]
            else:
                system[key] = item[key]
        exoplanets[starname]['planets'].append(planet)
    else:
        stnames.append(starname)
        system = {
            "name": starname,
            "planets": []
        }
        planet = {

        }
        for key in item:
            if key[0] == 'p' and key != 'pl_hostname':
                planet[key] = item[key]
            else:
                system[key] = item[key]
        system['planets'].append(planet)
        exoplanets[starname] = system

exoplanetsarray = []

for key in exoplanets:
    exoplanetsarray.append(exoplanets[key])



outfile = open('newexoplanets.json','w')
json.dump(exoplanetsarray,outfile,indent=4)