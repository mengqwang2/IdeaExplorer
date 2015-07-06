import os
import dataParse

if __name__=="__main__":
	dp=dataParse.dataParse("../data/ideas.txt")
	dp.concatedField("../data/fieldList.txt")

