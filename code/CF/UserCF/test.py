from scikits.crab import datasets
movies = datasets.load_sample_movies()
songs = datasets.load_sample_songs()
print movies.data
from scikits.crab.models import MatrixPreferenceDataModel
model = MatrixPreferenceDataModel(movies.data)
from scikits.crab.metrics import pearson_correlation
from scikits.crab.similarities import UserSimilarity
similarity = UserSimilarity(model, pearson_correlation)
from scikits.crab.recommenders.knn import UserBasedRecommender
recommender = UserBasedRecommender(model, similarity, with_preference=True)
recommender.recommend(5)
print recommender