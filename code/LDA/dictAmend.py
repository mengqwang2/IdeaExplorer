import os
import dataParse

if __name__=="__main__":
	dictlist=set()
	dp=dataParse.dataParse("../../data/ideas.txt")
	des=dp.fieldParse("tags")
	for d in des:
		tagList=[]
		tagList=d.split(',')
		for t in tagList:
			if(t):
				wordList=t.split(' ')
				for w in wordList:
					if(w):
						if(w[0]=='#'):
							dictlist.add(unicode(w[1:]).encode('utf-8'))
						else:
							dictlist.add(unicode(w).encode('utf-8'))

	with open("dictnostops.txt","r") as fo:
		for line in fo:
			dictlist.add(line[:-1])
	
	fo=open("dictnostops.txt","w+")
	
	for ele in dictlist:
		fo.write(ele+"\n")

	fo.close()