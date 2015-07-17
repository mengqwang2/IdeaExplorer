from scikits.crab.models.classes import MatrixPreferenceDataModel
from scikits.crab.recommenders.knn.classes import ItemBasedRecommender
from scikits.crab.similarities.basic_similarities import ItemSimilarity
from scikits.crab.recommenders.knn.item_strategies import ItemsNeighborhoodStrategy
from scikits.crab.metrics.pairwise import euclidean_distances

movies = {'Marcel Caraciolo': {'Lady in the Water': 2.5, \
     'Snakes on a Plane': 3.5, \
     'Just My Luck': 3.0, 'Superman Returns': 3.5, 'You, Me and Dupree': 2.5, \
     'The Night Listener': 3.0}, \
     'Paola Pow': {'Lady in the Water': 3.0, 'Snakes on a Plane': 3.5, \
     'Just My Luck': 1.5, 'Superman Returns': 5.0, 'The Night Listener': 3.0, \
     'You, Me and Dupree': 3.5}, \
    'Leopoldo Pires': {'Lady in the Water': 2.5, 'Snakes on a Plane': 3.0, \
     'Superman Returns': 3.5, 'The Night Listener': 4.0}, \
    'Lorena Abreu': {'Snakes on a Plane': 3.5, 'Just My Luck': 3.0, \
     'The Night Listener': 4.5, 'Superman Returns': 4.0, \
     'You, Me and Dupree': 2.5}, \
    'Steve Gates': {'Lady in the Water': 3.0, 'Snakes on a Plane': 4.0, \
     'Just My Luck': 2.0, 'Superman Returns': 3.0, 'The Night Listener': 3.0, \
     'You, Me and Dupree': 2.0}, \
    'Sheldom': {'Lady in the Water': 3.0, 'Snakes on a Plane': 4.0, \
     'The Night Listener': 3.0, 'Superman Returns': 5.0, \
     'You, Me and Dupree': 3.5}, \
    'Penny Frewman': {'Snakes on a Plane':4.5,'You, Me and Dupree':1.0, \
    'Superman Returns':4.0}, \
    'Maria Gabriela': {}}


model = MatrixPreferenceDataModel(movies)
items_strategy = ItemsNeighborhoodStrategy()
similarity = ItemSimilarity(model, euclidean_distances)
recsys = ItemBasedRecommender(model, similarity, items_strategy)

#Return the recommendations for the given user.
print recsys.recommend('Leopoldo Pires')

#Return the 2 explanations for the given recommendation.
print recsys.recommended_because('Leopoldo Pires', 'Just My Luck',2)