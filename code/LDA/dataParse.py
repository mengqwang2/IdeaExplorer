import os
import jsonParser
import nltk
import sys

class dataParse():
	def __init__(self,fp):
		self.__jp=jsonParser.jsonParser(fp)
		self.__filePath=fp
		self.__jp.parse()
		self.__ideas=self.__jp.getJsonDict()

	def parse2file(self,fp):
		fo=open(fp,"w+")

		for k1,v1 in inno.iteritems():
			if (k1=='data'):
				for entry in v1:
					for k2,v2 in entry.iteritems():
						fo.write(unicode(k2).encode('utf-8')+": "+unicode(v2).encode('utf-8')+"\n")
				fo.write("\n")
		fo.close()

	def fieldParse(self,fname):
		fieldList=[]
		for ind in self.__ideas['data']:
			fieldList.append(ind[fname])

		return fieldList
