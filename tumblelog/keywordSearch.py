import dataParse
import numpy
import os,sys

class KeywordSearch():
	def __init__(self,kw):
		self.__dp=dataParse.dataParse("data/ideas.txt")
		self.__vocab=file("data/vocabulary.txt").readlines()
		self.__keyword=kw
		self.__lambda=numpy.loadtxt(file("data/LDAResult/lambda-10.dat"))
		self.__gamma=numpy.loadtxt(file("data/LDAResult/gamma.dat"))
		self.__indexList=[]

	def gammaParser(self):
		for line in self.__gamma:
			self.__indexList.append(int(line[0]))
		self.__gamma=self.__gamma[:,1:]
		

	def tagSearch(self,key_word):
		temp_id = []
		f = open("data/tag_set.txt")
		tagset = f.readline().split()
		for word in key_word:
			i=0
			for tag in tagset:
				if str(word) == str(tag):
					temp_id.append(i)
				i = i+1
		tag_distribution=[]

		for item in range(0,len(tagset)):
			tag_distribution.append(f.readline().split())

		document_id = set()

		for i in temp_id:
			for j in tag_distribution[i]:
				document_id.add(self.__indexList[int(j)])
		f.close()
		return document_id

	def topicSearch(self,key_word,vocab,lb):
		word_set=[]
		j=0
		for word in vocab:
			for kw in key_word:
				if kw+"\n"==word:
					word_set.append(j)
			j=j+1

		for word_id in word_set:
			temp = lb[:,word_id]
			temp = zip(temp, range(0,len(temp)))
			rank = sorted(temp, key = lambda x: x[0],reverse=True)
			return [rank[0][1],rank[1][1]]

	def documentSearch(self,topic_set,gamma):
		document_id = set()
		for topic_id in topic_set:
			temp = gamma[:,topic_id]
			temp = zip(temp, range(0,len(temp)))
			rank = sorted(temp, key = lambda x: x[0],reverse=True)
			document_id.add(self.__indexList[rank[0][1]])
			document_id.add(self.__indexList[rank[1][1]])
		return document_id


	def doSearch(self):
		self.gammaParser()
		topic_id = self.topicSearch(self.__keyword,self.__vocab,self.__lambda)
		document_id = self.documentSearch(topic_id,self.__gamma)
		d=self.tagSearch(self.__keyword)
		docset=d.union(document_id)
		return docset
