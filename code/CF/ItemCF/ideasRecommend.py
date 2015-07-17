from scikits.crab.models.classes import MatrixPreferenceDataModel
from scikits.crab.recommenders.knn.classes import ItemBasedRecommender
from scikits.crab.similarities.basic_similarities import ItemSimilarity
from scikits.crab.recommenders.knn.item_strategies import ItemsNeighborhoodStrategy
from scikits.crab.metrics.pairwise import euclidean_distances
import numpy as np


def getIdeas():
	gamma=[]
	for ind in range(0,1):
		fp="../../../data/LDAResult/gamma-"+str(ind*10)+".dat"
		arr=np.loadtxt(fp)
		for line in arr:
			#norm = [float(i)/sum(line) for i in line]
			gamma.append(line)

	#print gamma

	distDict=dict()
	i=0
	for row in gamma:
		distDict[i]=dict()
		j=0
		for col in row:
			distDict[i][j]=col
			j=j+1
		i=i+1

	return distDict

if __name__=="__main__":
	data=getIdeas()
	print data
	model = MatrixPreferenceDataModel(data)
	print model
	items_strategy = ItemsNeighborhoodStrategy()
	print items_strategy
	similarity = ItemSimilarity(model, euclidean_distances)
	print similarity
	recsys = ItemBasedRecommender(model, similarity, items_strategy)

	#Return the recommendations for the given user.
	#print recsys.recommend(55)

	#Return the 2 explanations for the given recommendation.
	#print recsys.recommended_because('Leopoldo Pires', 'Just My Luck',2)






